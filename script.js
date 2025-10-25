document.addEventListener('DOMContentLoaded', () => {
    let allPlayers = []; 
    let displayedPlayers = []; 
    let currentSort = { key: null, direction: 'desc' };
    let selectedPlayerForComparison = null;
    let playerToCompare = null;

    function normalizeString(str) {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    const filterForm = document.getElementById('filterForm');
    const playerList = document.getElementById('playerList');
    const generalPositionFilter = document.getElementById('generalPositionFilter');
    const positionFilter = document.getElementById('positionFilter');
    const teamFilter = document.getElementById('teamFilter');
    const countryFilter = document.getElementById('countryFilter');

    const positionKeys = ['gk', 'cb', 'lb', 'rb', 'dmf', 'cmf', 'lmf', 'rmf', 'amf', 'lwf', 'rwf', 'ss', 'cf'];
    const positionColorMap = { 0: 'bg-gray-700 text-gray-400', 1: 'bg-green-800 text-green-200', 2: 'bg-green-500 text-white' };
    const positionOrderMap = { 'GK': 1, 'CB': 2, 'LB': 3, 'RB': 4, 'DMF': 5, 'CMF': 6, 'LMF': 7, 'RMF': 8, 'AMF': 9, 'LWF': 10, 'RWF': 11, 'SS': 12, 'CF': 13 };
    const modalAttributeKeys = [ "offensive_awareness", "ball_control", "dribbling", "tight_possession", "low_pass", "lofted_pass", "finishing", "heading", "place_kicking", "curl", "speed", "acceleration", "kicking_power", "jump", "physical_contact", "balance", "stamina", "defensive_awareness", "ball_winning", "aggression", "gk_awareness", "gk_catching", "gk_clearing", "gk_reflexes", "gk_reach" ];
    const skillKeys = [ "trickster", "mazing_run", "speeding_bullet", "incisive_run", "long_ball_expert", "early_cross", "long_ranger", "scissors_feint", "double_touch", "flip_flap", "marseille_turn", "sombrero", "cross_over_turn", "cut_behind_and_turn", "scotch_move", "step_on_skill_control", "heading_special", "long_range_drive", "chip_shot_control", "long_range_shot", "knuckle_shot", "dipping_shots", "rising_shots", "acrobatic_finishing", "heel_trick", "first_time_shot", "one_touch_pass", "through_passing", "weighted_pass", "pinpoint_crossing", "outside_curler", "rabona", "no_look_pass", "low_lofted_pass", "gk_low_punt", "gk_high_punt", "long_throw", "gk_long_throw", "penalty_specialist", "gk_penalty_saver", "gamesmanship", "man_marking", "track_back", "interception", "acrobatic_clear", "captaincy", "super_sub", "fighting_spirit" ];
    const generalPositionMap = { 'GK': ['GK'], 'DF': ['CB', 'LB', 'RB'], 'MF': ['DMF', 'CMF', 'LMF', 'RMF', 'AMF'], 'FW': ['LWF', 'RWF', 'SS', 'CF'] };

    const ALWAYS_EXCLUDE_TEAMS = ['ML DEFAULT ASIA', 'ML DEFAULT EUROPE', 'ML DEFAULT LATINAMERICA'];
    const EXCLUDE_ON_DEFAULT_TEAMS = [
        'FREE AGENT', 'AC MILAN 88-89', 'AFC AJAX 71-72', 'ARSENAL FC 03-04', 'ATLÉTICO DE MADRID 95-96',
        'BORUSSIA DORTMUND 96-97', 'CA BOCA JUNIORS 00-01', 'EUROPEAN CLASSICS', 'FC BARCELONA 91-92',
        'FC BAYERN MÜNCHEN 00-01', 'FC INTER 05-06', 'JUVENTUS FC 02-03', 'LIVERPOOL FC 04-05',
        'MANCHESTER UNITED FC 98-99', 'PES LEGENDS EUROPE', 'PES LEGENDS WORLD', 'REAL MADRID CF 04-05',
        'SANTOS FC 62-63', 'SSC NAPOLI 87-88', 'WORLD CLASSICS'
    ];

    function getPositionColor(position) {
        if (!position) return 'bg-gray-400';
        const pos = position.toUpperCase();
        if (pos === 'GK') return 'bg-yellow-500';
        if (['CB', 'LB', 'RB'].includes(pos)) return 'bg-blue-500';
        if (['DMF', 'CMF', 'LMF', 'RMF', 'AMF'].includes(pos)) return 'bg-green-500';
        if (['LWF', 'RWF', 'SS', 'CF'].includes(pos)) return 'bg-red-500';
        return 'bg-gray-400';
    }

    function renderFootDisplay(foot) {
        let isLeft = (foot == 1 || String(foot).toUpperCase() === 'TRUE');
        let isRight = (foot == 0 || String(foot).toUpperCase() === 'FALSE');
        const leftClass = isLeft ? 'font-bold text-lg text-gray-200' : 'font-bold text-lg text-gray-400';
        const rightClass = isRight ? 'font-bold text-lg text-gray-200' : 'font-bold text-lg text-gray-400';
        return { leftClass, rightClass };
    }

    function highlightRow(clickedRow, player) {
        const previouslySelected = document.querySelector('.selected-player');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected-player');
        }
        if (clickedRow && clickedRow !== previouslySelected) {
            clickedRow.classList.add('selected-player');
            selectedPlayerForComparison = player;
        } else {
            selectedPlayerForComparison = null;
        }
    }
    
    function renderPlayers() {
        playerList.innerHTML = '';
        if (displayedPlayers.length === 0) {
            playerList.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">No matching players found.</td></tr>`;
            return;
        }

        displayedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = 'group cursor-pointer';
            row.dataset.index = index; 
            row.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap align-middle"><div class="flex items-center"><span class="h-4 w-1.5 rounded-sm ${getPositionColor(player.position_name)} mr-2"></span><span class="font-bold text-sm">${player.position_name || 'N/A'}</span></div></td>
                <td class="px-6 py-3 whitespace-nowrap align-middle"><div class="text-sm font-medium text-gray-900 dark:text-white">${player.player_name}</div></td>
                <td class="px-2 py-3 whitespace-nowrap align-middle"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">${player.overall_rating}</span></td>
                <td class="relative px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell align-middle">
                    <span class="height-cell-content transition-opacity duration-200">${player.height} cm</span>
                    <div class="vs-button absolute inset-0 pt-3 pl-2 opacity-0 transition-opacity duration-200 pointer-events-none">
                        <div class="flex items-center justify-center h-7 w-16 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
                                <span>VS</span>
                        </div>
                    </div>
                </td>
                <td class="relative px-6 py-3 whitespace-nowrap hidden md:table-cell align-middle">
                    <div class="foot-text-container flex justify-left items-center space-x-px transition-opacity duration-200">
                        ${(() => { const { leftClass, rightClass } = renderFootDisplay(player.foot); return `<span class="${leftClass}">L</span><span class="text-gray-500 mx-1">/</span><span class="${rightClass}">R</span>`; })()}
                    </div>
                    <div class="show-details-btn absolute inset-0 pt-3 pl-4 opacity-0 transition-opacity duration-200 pointer-events-none">
                        <div class="h-7 w-12 px-2 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
                        </div>
                    </div>
                </td>
                <td class="relative px-1 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell align-middle">
                    <span class="club-name-text transition-opacity duration-200">${player.team_name || 'Free Agent'}</span>
                </td>
            `;
            playerList.appendChild(row);
        });
    }

    function sortPlayers(key) {
        const isSameKey = currentSort.key === key;
        let newDirection = isSameKey ? (currentSort.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        if (key === 'overall_rating' || key === 'height') { newDirection = isSameKey ? (currentSort.direction === 'asc' ? 'desc' : 'asc') : 'desc'; }
        currentSort = { key, direction: newDirection };
        displayedPlayers.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            if (key === 'position_name') { valA = positionOrderMap[valA] || 99; valB = positionOrderMap[valB] || 99; }
            else if (typeof valA === 'string') { return newDirection === 'asc' ? valA.localeCompare(valB, 'en', { sensitivity: 'base' }) : valB.localeCompare(valA, 'en', { sensitivity: 'base' }); }
            if (valA < valB) return newDirection === 'asc' ? -1 : 1;
            if (valA > valB) return newDirection === 'asc' ? 1 : -1;
            return 0;
        });
        updateSortVisuals();
        renderPlayers();
    }

    function updateSortVisuals() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('active', 'text-amber-400');
            header.classList.add('text-gray-900', 'dark:text-white');
            header.querySelector('.sort-icon-container').innerHTML = '';
        });
        const activeHeader = document.querySelector(`.sortable[data-sort="${currentSort.key}"]`);
        if (activeHeader) {
            activeHeader.classList.add('active', 'text-amber-400');
            activeHeader.classList.remove('text-gray-900', 'dark:text-white');
            const iconContainer = activeHeader.querySelector('.sort-icon-container');
            const upIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>`;
            const downIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
            iconContainer.innerHTML = currentSort.direction === 'asc' ? upIcon : downIcon;
        }
    }
    
    function closeModal() { document.getElementById('playerModal').classList.add('hidden'); }
    function closeCmpModal() { document.getElementById('comparisonModal').classList.add('hidden'); }
    function executeSearch() {
        const searchTerm = normalizeString(document.getElementById('searchInput').value);
        const team = teamFilter.value;
        const country = countryFilter.value;
        const generalPos = generalPositionFilter.value;
        const specificPos = positionFilter.value;
        const minOvr = parseInt(document.getElementById('minOvr').value, 10) || 40;
        const maxOvr = parseInt(document.getElementById('maxOvr').value, 10) || 99;
        const isDefaultSearch = searchTerm === '' && team === '' && country === '' && 
                                generalPos === '' && specificPos === '' && 
                                minOvr === 40 && maxOvr === 99;

        let searchResults = allPlayers.filter(player => {
            const teamName = player.team_name || 'Free Agent';

            if (ALWAYS_EXCLUDE_TEAMS.includes(teamName)) {
                return false;
            }

            if (isDefaultSearch && EXCLUDE_ON_DEFAULT_TEAMS.includes(teamName)) {
                return false;
            }

            const nameMatch = searchTerm === '' || normalizeString(player.player_name).includes(searchTerm);
            const teamMatch = team === '' || teamName === team;
            const countryMatch = country === '' || player.country_name === country;
            const ovrMatch = player.overall_rating >= minOvr && player.overall_rating <= maxOvr;

            let positionMatch = true;
            if (specificPos) {
                positionMatch = player.position_name === specificPos;
            } else if (generalPos) {
                const positionsInGeneral = generalPositionMap[generalPos] || [];
                positionMatch = positionsInGeneral.includes(player.position_name);
            }

            return nameMatch && teamMatch && countryMatch && ovrMatch && positionMatch;
        });

        searchResults.sort((a, b) => b.overall_rating - a.overall_rating);

        if (isDefaultSearch && searchResults.length > 100) {
            displayedPlayers = searchResults.slice(0, 100);
        } else if (!isDefaultSearch && searchResults.length > 100) {
            displayedPlayers = searchResults.slice(0, 100);
        } else {
            displayedPlayers = searchResults;
        }
        
        currentSort = { key: 'overall_rating', direction: 'desc' };
        updateSortVisuals();

        renderPlayers();
    }
    
    function setIconLabel(container, text, iconUrl, altText, truncate = false) {
        container.innerHTML = '';
        const textSpan = document.createElement('span');
        textSpan.textContent = text || 'N/A';
        if (truncate) textSpan.classList.add('truncate-label');
        container.appendChild(textSpan);

        if (iconUrl && text) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = altText;
            img.onerror = () => { img.style.display = 'none'; };
            container.appendChild(img);
        }
    }

    function showPlayerDetails(playerId) {
        const player = displayedPlayers.find(p => p.player_id === playerId);
        if (!player) return;
        document.getElementById('modalPlayerName').textContent = player.player_name;
        const playerImage = document.getElementById('modalPlayerImage');
        playerImage.onerror = function() { this.onerror=null; this.src='assets/minifaces/0.png'; };
        playerImage.src = player.player_image_url;
        document.getElementById('modalHeight').textContent = player.height;
        document.getElementById('modalWeight').textContent = player.weight;
        document.getElementById('modalAge').textContent = player.age;
        setIconLabel(document.getElementById('modalCountry'), player.country_name, player.country_flag_url, 'Flag', false);
        setIconLabel(document.getElementById('modalTeam'), player.team_name, player.team_emblem_url, 'Emblem', true);
        const { leftClass, rightClass } = renderFootDisplay(player.foot);
        document.getElementById('modalFootLeft').className = leftClass;
        document.getElementById('modalFootRight').className = rightClass;
        document.getElementById('modalOverall').textContent = player.overall_rating;
        document.getElementById('modalPositionColor').className = `h-4 w-1.5 rounded-sm mr-2 ${getPositionColor(player.position_name)}`;
        document.getElementById('modalRegisteredPosition').textContent = player.position_name || 'N/A';
        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = '';
        modalAttributeKeys.forEach(statKey => {
            let statName = statKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Gk ', 'GK ');
            const statValue = player[statKey];
            if (statValue !== undefined && statValue !== null) {
                statsContainer.innerHTML += `<div class="flex items-center justify-between"><span class="text-gray-400" style="width: 45%; flex-shrink: 0;">${statName}</span><div class="flex items-center space-x-2" style="width: 55%;"><div class="stat-bar flex-1 h-2"><div class="stat-bar-inner bg-blue-500" style="width: ${statValue}%;"></div></div><span class="font-semibold w-6 text-right">${statValue}</span></div></div>`;
            }
        });
        const playingStyleList = document.getElementById('playingStyleList');
        playingStyleList.innerHTML = '';
        const psListItem = document.createElement('li');
        psListItem.textContent = player.playing_style_name || 'None';
        if (!player.playing_style_name) psListItem.className = 'text-gray-500';
        playingStyleList.appendChild(psListItem);
        const skillsListContainer = document.getElementById('skillsListContainer');
        skillsListContainer.innerHTML = '';
        let hasSkills = false;
        skillKeys.forEach(key => {
            if (player[key] == 1) {
                hasSkills = true;
                const listItem = document.createElement('li');
                listItem.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                skillsListContainer.appendChild(listItem);
            }
        });
        if (!hasSkills) {
            const listItem = document.createElement('li');
            listItem.textContent = 'This player has no special skills.';
            listItem.className = 'text-gray-500';
            skillsListContainer.appendChild(listItem);
        }
        document.getElementById('modalForm').textContent = player.form || 'N/A';
        document.getElementById('modalInjuryResistance').textContent = player.injury_resistance || 'N/A';
        document.getElementById('modalWeakFootUsage').textContent = player.weak_foot_usage || 'N/A';
        document.getElementById('modalWeakFootAcc').textContent = player.weak_foot_acc || 'N/A';
        positionKeys.forEach(posKey => {
            const element = document.getElementById(`pos-${posKey}`);
            if (element) {
                const baseClasses = element.className.replace(/bg-\S+/g, '').replace(/text-\S+/g, '').trim();
                element.className = `${baseClasses} ${positionColorMap[player[posKey]] || positionColorMap[0]}`;
            }
        });
        document.getElementById('playerModal').classList.remove('hidden');
        switchTab('attributes');
    }

    function showComparisonModal(player1, player2) {
        if (!player1 || !player2) return;
        document.getElementById('cmpModalPlayer1Image').src = player1.player_image_url;
        document.getElementById('cmpModalPlayer2Image').src = player2.player_image_url;
        
        document.getElementById('cmpModalPlayerName1').textContent = player1.player_name;
        document.getElementById('cmpModalHeight1').textContent = player1.height;
        document.getElementById('cmpModalWeight1').textContent = player1.weight;
        document.getElementById('cmpModalAge1').textContent = player1.age;
        const foot1 = renderFootDisplay(player1.foot);
        document.getElementById('cmpModalFootLeft1').className = foot1.leftClass;
        document.getElementById('cmpModalFootRight1').className = foot1.rightClass;
        setIconLabel(document.getElementById('cmpModalCountry1'), player1.country_name, player1.country_flag_url, 'Flag', false);
        setIconLabel(document.getElementById('cmpModalTeam1'), player1.team_name, player1.team_emblem_url, 'Emblem', true);
        document.getElementById('cmpModalPositionColor1').className = `h-4 w-1.5 rounded-sm mr-2 ${getPositionColor(player1.position_name)}`;
        document.getElementById('cmpModalRegisteredPosition1').textContent = player1.position_name || 'N/A';
        document.getElementById('cmpModalOverall1').textContent = player1.overall_rating;
        document.getElementById('cmpModalPlayerName2').textContent = player2.player_name;
        document.getElementById('cmpModalHeight2').textContent = player2.height;
        document.getElementById('cmpModalWeight2').textContent = player2.weight;
        document.getElementById('cmpModalAge2').textContent = player2.age;
        const foot2 = renderFootDisplay(player2.foot);
        document.getElementById('cmpModalFootLeft2').className = foot2.leftClass;
        document.getElementById('cmpModalFootRight2').className = foot2.rightClass;
        setIconLabel(document.getElementById('cmpModalCountry2'), player2.country_name, player2.country_flag_url, 'Flag', false);
        setIconLabel(document.getElementById('cmpModalTeam2'), player2.team_name, player2.team_emblem_url, 'Emblem', true);
        document.getElementById('cmpModalPositionColor2').className = `h-4 w-1.5 rounded-sm mr-2 ${getPositionColor(player2.position_name)}`;
        document.getElementById('cmpModalRegisteredPosition2').textContent = player2.position_name || 'N/A';
        document.getElementById('cmpModalOverall2').textContent = player2.overall_rating;
        const statsContainer = document.getElementById('comparisonStatsContainer');
        statsContainer.innerHTML = '';
        modalAttributeKeys.forEach(statKey => {
            const statName = statKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Gk ', 'GK ');
            const val1 = player1[statKey] || 0;
            const val2 = player2[statKey] || 0;
            let diff = val2 - val1;
            let indicator = '-';
            let colorClass = 'text-gray-400';
            if (diff > 0) { indicator = '▲'; colorClass = 'text-green-400'; } 
            else if (diff < 0) { indicator = '▼'; colorClass = 'text-red-400'; }
            statsContainer.innerHTML += `<div class="flex items-center space-x-3 text-sm py-0.5"><div class="flex-1 flex items-center space-x-2" title="${player1.player_name}: ${val1}"><span class="font-semibold w-6 text-right text-blue-300">${val1}</span><div class="w-full h-2 rounded-full bg-gray-700 overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width: ${val1}%;"></div></div></div><div class="w-40 text-center text-gray-400 truncate shrink-0">${statName}</div><div class="flex-1 flex items-center space-x-2" title="${player2.player_name}: ${val2}"><div class="w-full h-2 rounded-full bg-gray-700 overflow-hidden"><div class="h-full bg-red-500 rounded-full" style="width: ${val2}%;"></div></div><span class="font-semibold w-6 text-left text-red-300">${val2}</span></div><div class="w-16 text-left font-mono font-bold ${colorClass} shrink-0">${indicator} <span class="text-xs">${diff !== 0 ? Math.abs(diff) : ''}</span></div></div>`;
        });
        const psList1 = document.getElementById('cmpPlayingStyleList1');
        psList1.innerHTML = `<li>${player1.playing_style_name || 'None'}</li>`;
        if(!player1.playing_style_name) psList1.firstElementChild.className = 'text-gray-500';
        const skillsList1 = document.getElementById('cmpSkillsListContainer1');
        skillsList1.innerHTML = '';
        let hasSkills1 = false;
        skillKeys.forEach(key => { if (player1[key] == 1) { hasSkills1 = true; skillsList1.innerHTML += `<li>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`; } });
        if (!hasSkills1) skillsList1.innerHTML = `<li class="text-gray-500">This player has no special skills.</li>`;
        document.getElementById('cmpModalForm1').textContent = player1.form || 'N/A';
        document.getElementById('cmpModalInjuryResistance1').textContent = player1.injury_resistance || 'N/A';
        document.getElementById('cmpModalWeakFootUsage1').textContent = player1.weak_foot_usage || 'N/A';
        document.getElementById('cmpModalWeakFootAcc1').textContent = player1.weak_foot_acc || 'N/A';
        const psList2 = document.getElementById('cmpPlayingStyleList2');
        psList2.innerHTML = `<li>${player2.playing_style_name || 'None'}</li>`;
            if(!player2.playing_style_name) psList2.firstElementChild.className = 'text-gray-500';
        const skillsList2 = document.getElementById('cmpSkillsListContainer2');
        skillsList2.innerHTML = '';
        let hasSkills2 = false;
        skillKeys.forEach(key => { if (player2[key] == 1) { hasSkills2 = true; skillsList2.innerHTML += `<li>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`; } });
        if (!hasSkills2) skillsList2.innerHTML = `<li class="text-gray-500">This player has no special skills.</li>`;
        document.getElementById('cmpModalForm2').textContent = player2.form || 'N/A';
        document.getElementById('cmpModalInjuryResistance2').textContent = player2.injury_resistance || 'N/A';
        document.getElementById('cmpModalWeakFootUsage2').textContent = player2.weak_foot_usage || 'N/A';
        document.getElementById('cmpModalWeakFootAcc2').textContent = player2.weak_foot_acc || 'N/A';
        positionKeys.forEach(posKey => {
            const el1 = document.getElementById(`cmp1-pos-${posKey}`);
            if (el1) {
                const baseClasses = el1.className.replace(/bg-\S+/g, '').replace(/text-\S+/g, '').trim();
                el1.className = `${baseClasses} ${positionColorMap[player1[posKey]] || positionColorMap[0]}`;
            }
            const el2 = document.getElementById(`cmp2-pos-${posKey}`);
                if (el2) {
                const baseClasses = el2.className.replace(/bg-\S+/g, '').replace(/text-\S+/g, '').trim();
                el2.className = `${baseClasses} ${positionColorMap[player2[posKey]] || positionColorMap[0]}`;
            }
        });
        document.getElementById('comparisonModal').classList.remove('hidden');
        switchCmpTab('attributes'); 
    }

    function switchTab(tabName) {
        document.querySelectorAll('#playerModal .tab-pane').forEach(pane => pane.classList.add('hidden'));
        document.getElementById(`${tabName}Content`).classList.remove('hidden');
        document.querySelectorAll('#playerModal .tab-button').forEach(button => {
            button.classList.remove('border-blue-500', 'text-blue-400');
            button.classList.add('border-transparent', 'text-gray-500');
        });
        const activeButton = document.querySelector(`#playerModal .tab-button[data-tab="${tabName}"]`);
        activeButton.classList.add('border-blue-500', 'text-blue-400');
        activeButton.classList.remove('border-transparent', 'text-gray-500');
    }

    function switchCmpTab(tabName) {
        document.querySelectorAll('#comparisonModal .tab-pane-cmp').forEach(pane => pane.classList.add('hidden'));
        document.getElementById(`comparison${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Content`).classList.remove('hidden');
        document.querySelectorAll('#comparisonModal .tab-button-cmp').forEach(button => {
            button.classList.remove('border-blue-500', 'text-blue-400');
            button.classList.add('border-transparent', 'text-gray-500');
        });
        const activeButton = document.querySelector(`#comparisonModal .tab-button-cmp[data-tab="${tabName}"]`);
        activeButton.classList.add('border-blue-500', 'text-blue-400');
        activeButton.classList.remove('border-transparent', 'text-gray-500');
    }

    function populateFilters() {
        const teams = [...new Set(allPlayers.map(p => p.team_name || 'Free Agent'))]
            .filter(team => !ALWAYS_EXCLUDE_TEAMS.includes(team))
            .filter(team => team.toUpperCase() !== 'FREE AGENT')
            .sort();
            
        const countries = [...new Set(allPlayers.map(p => p.country_name).filter(Boolean))].sort(); 

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country.toUpperCase();
            countryFilter.appendChild(option);
        });
    }

    function populateAndManageSpecificPositions(generalPosition) {
        positionFilter.innerHTML = '<option value="">Select Specific Position</option>';
        if (generalPosition && generalPositionMap[generalPosition]) {
            if (generalPosition === 'GK') {
                positionFilter.setAttribute('disabled', 'true');
                positionFilter.value = '';
            } else {
                generalPositionMap[generalPosition].forEach(pos => {
                    const option = document.createElement('option');
                    option.value = pos;
                    option.textContent = pos;
                    positionFilter.appendChild(option);
                });
                positionFilter.removeAttribute('disabled');
            }
        } else {
            positionFilter.setAttribute('disabled', 'true');
        }
    }
    
    async function loadData() {
        try {
            playerList.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500"><div class="flex justify-center items-center space-x-2"><div class="spinner"></div><span>Loading player database...</span></div></td></tr>`;
            
            const response = await fetch('players.json');
            if (!response.ok) {
                throw new Error(`Failed to load players.json (Error: ${response.status})`);
            }
            allPlayers = await response.json();
            

            populateFilters(); 
            

        } catch (error) {
            console.error('Error loading data:', error);
            playerList.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-red-500"><p class="text-xl">${error.message}.</p><p>Please make sure 'players.json' is in the same folder as index.html.</p></td></tr>`;
        }
    }


    async function init() {
        generalPositionFilter.addEventListener('change', (e) => {
            populateAndManageSpecificPositions(e.target.value);
            positionFilter.value = ''; 
        });

        populateAndManageSpecificPositions('');

        playerList.addEventListener('click', (e) => {
            const row = e.target.closest('tr.group');
            if (!row) return;
        
            const playerIndex = parseInt(row.dataset.index, 10);
            if (isNaN(playerIndex)) return;
            const player = displayedPlayers[playerIndex];
            
            if (!player) return; 

            const vsButton = e.target.closest('.vs-button');
            const detailsButton = e.target.closest('.show-details-btn');
        
            if (vsButton) {
                e.stopPropagation();
                playerToCompare = player;
                if (selectedPlayerForComparison && playerToCompare) {
                    showComparisonModal(selectedPlayerForComparison, playerToCompare);
                }
            } else if (detailsButton) {
                e.stopPropagation();
                highlightRow(row, player);
                showPlayerDetails(player.player_id);
            } else {
                highlightRow(row, player);
            }
        });

        playerList.addEventListener('mouseover', (e) => {
            const row = e.target.closest('tr.group');
            if (!row) return;
            if (!row.classList.contains('selected-player')) {
                row.classList.add('dark:bg-gray-700', 'bg-gray-100');
            }
            const playerIndex = parseInt(row.dataset.index, 10);
            if (isNaN(playerIndex)) return;
            const player = displayedPlayers[playerIndex];
            if (!player) return;
            
            const heightCell = row.querySelector('.height-cell-content');
            const vsButton = row.querySelector('.vs-button');
            const footContainer = row.querySelector('.foot-text-container');
            const detailsButton = row.querySelector('.show-details-btn');

            if (selectedPlayerForComparison && selectedPlayerForComparison.player_id !== player.player_id) {
                if (heightCell) heightCell.style.opacity = '0';
                if (vsButton) { vsButton.style.opacity = '1'; vsButton.style.pointerEvents = 'auto'; }
            } else {
                if (footContainer) footContainer.style.opacity = '0';
                if (detailsButton) { detailsButton.style.opacity = '1'; detailsButton.style.pointerEvents = 'auto'; }
            }
        });
        playerList.addEventListener('mouseout', (e) => {
            const row = e.target.closest('tr.group');
            if (!row) return;
            row.classList.remove('dark:bg-gray-700', 'bg-gray-100');
            const heightCell = row.querySelector('.height-cell-content');
            if (heightCell) heightCell.style.opacity = '1';
            const vsButton = row.querySelector('.vs-button');
            if (vsButton) { vsButton.style.opacity = '0'; vsButton.style.pointerEvents = 'none'; }
            const footContainer = row.querySelector('.foot-text-container');
            if (footContainer) footContainer.style.opacity = '1';
            const detailsButton = row.querySelector('.show-details-btn');
            if (detailsButton) { detailsButton.style.opacity = '0'; detailsButton.style.pointerEvents = 'none'; }
        });
        
        filterForm.addEventListener('submit', (e) => { e.preventDefault(); executeSearch(); });
        
        document.getElementById('resetAllFilters').addEventListener('click', () => {
            filterForm.reset();
            document.getElementById('minOvr').value = '';
            document.getElementById('maxOvr').value = '';
            generalPositionFilter.value = '';
            populateAndManageSpecificPositions('');
        });

        document.querySelectorAll('.sortable').forEach(header => { header.addEventListener('click', () => sortPlayers(header.dataset.sort)); });
        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('playerModal').addEventListener('click', (e) => { if (e.target.id === 'playerModal') closeModal(); });
        document.getElementById('modalTabs').addEventListener('click', (e) => { 
            const button = e.target.closest('.tab-button');
            if (button) switchTab(button.dataset.tab);
        });
        document.getElementById('closeCmpModal').addEventListener('click', closeCmpModal);
        document.getElementById('comparisonModal').addEventListener('click', (e) => { if (e.target.id === 'comparisonModal') closeCmpModal(); });
        document.getElementById('cmpModalTabs').addEventListener('click', (e) => {
            const button = e.target.closest('.tab-button-cmp');
            if (button) switchCmpTab(button.dataset.tab);
        });

        startFlickerAnimation();

        await loadData();
        
        executeSearch();
    }
    
    function startFlickerAnimation() {
        const titleElement = document.getElementById('binary-title');
        if (!titleElement) return;
        const originalText = "PES 2021 Player Database";
        const binaryChars = "01";
        const flickerInterval = 850;
        const flickerDuration = 150;
        titleElement.textContent = originalText;
        setInterval(() => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * originalText.length);
            } while (originalText[randomIndex] === ' ');
            const originalChar = originalText[randomIndex];
            const randomBinary = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            const textArray = originalText.split('');
            textArray[randomIndex] = randomBinary;
            titleElement.textContent = textArray.join('');
            setTimeout(() => {
                titleElement.textContent = originalText; 
            }, flickerDuration);
        }, flickerInterval);
    }

    init();
});