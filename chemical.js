const leaf_tooltip_map = new WeakMap();

function get_leaf_tooltip(leaf_element) {
    const content = leaf_tooltip_map.get(leaf_element);
    if(content == null) {
        return 'Loading...';
    }
}

async function generate_leaf_tooltip(instance) {
    const leaf = instance.reference;
    if( leaf_tooltip_map.get(leaf) == null ) {
        const dataset = leaf.dataset;
        var content = "<table><tr>";
                const leaf_colour = get_leaf_colour(leaf.classList); 
                const title_line = get_title_line(dataset, leaf_colour);
                content += `<td>${title_line}</td>`;
            content += "</tr><tr>";
                content += `<td class="intro-line">Adjacent compounds with the same colour are chemically similiar.</td>`;
            content += "</tr>";
            const atc_mesh = await get_atc_mesh(dataset.pubchem, dataset.name);
            content += "<tr><td>";
        
        let atc_content = "";
        if (atc_mesh[0] && atc_mesh[1]) {
                atc_content = `<p class="atc-mesh">ATC code: <span>${atc_mesh[0]}</span></p><p class="atc-mesh">MeSH terms: <span>${atc_mesh[1]}</span></p>`;
        }
        else if (atc_mesh[2] && atc_mesh[2].length > 0) {
                atc_content = `<p class="atc-mesh">Description: <span>${atc_mesh[2]}</span></p>`;
        }

        content += `<div><img src=\"https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${dataset.pubchem}&t=l\" />${atc_content}</div>`;
        content += "</td></tr><tr>";
                const trial_ids = JSON.parse(dataset.trials);
                const trial_links = `<strong>Trials mentioning </strong>\'${dataset.name}\': ` + get_trial_search(trial_ids);            
        content += `<td colspan=\"2\" class="mention-line">${trial_links}</td></tr></table>`;
        leaf_tooltip_map.set(leaf, content);
        instance.setContent(content);        
    }
}

function get_leaf_colour(clist){
    const iterator = clist.values();
    for(let c of iterator) {
        if (c.startsWith('leafc_'))
            return c;
    }
    return null;
}

function get_title_line(dataset, leaf_colour) {
    if (dataset.name === "WHTVZRBIWZFKQO-AWEZNQCLSA-N") {
        dataset.name = "(S)-chloroquine";
    }
    return `<div class="tooltip-title"><svg width ="10" height="10" class="svglegend ${leaf_colour}"><rect width = "10" height="10"/></svg>`
            + `<strong>${dataset.name}</strong> (${dataset.chembl}, ` 
            + ` <a href="https://pubchem.ncbi.nlm.nih.gov/compound/${dataset.pubchem}" target="_blank">PubChem-${dataset.pubchem})</a></div>`;
}
async function get_atc_mesh(pubchem, name){
    let url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${pubchem}/JSON`;
    let response = await fetch(url);
    let info = await response.json();
    const toc = info.Record.Section.find(s=>s.TOCHeading == 'Pharmacology and Biochemistry');
    let atc_string = mesh_info = null;
    let other = "";
    if (toc) {
        const atc_section = toc.Section.find(s=> s.TOCHeading == 'ATC Code');
        const mesh_section = toc.Section.find(s=> s.TOCHeading == 'MeSH Pharmacological Classification');
        if (atc_section && mesh_section) {
            const atr_names = atc_section.Information.find( s=> s.Name == "ATC Code"); 
            const pstrings = atr_names.Value.StringWithMarkup.map(s=> s.String);
            const strings = pstrings.map(s => s.substring(s.indexOf(' - ')+2));
            atc_string = strings.join(' > ');
            mesh_info = mesh_section.Information.map(i => i.Name).join(' | ');
        }
    }
    if (atc_string == null || mesh_info == null) {
        const ename = encodeURIComponent(name);
        url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${ename}/description/JSON`;
        response = await fetch(url);
        info = await response.json();
        if(info.InformationList && info.InformationList.Information) {
            const desc = info.InformationList.Information.find( s => s.Description);
            if (desc) {
                other = desc.Description;
            }
        }
    }
    return [atc_string, mesh_info, other];
}

function get_trial_search(trial_ids){
    const page_size = 50;
    let total_len = trial_ids.length;
    let pages = [];
    let content = ' (';
    for (let i = 0; i < Math.ceil(total_len/page_size); i++) {
        let start = i*page_size;
        pages.push([start, Math.min(start + page_size, total_len)])
    } 
    content = ' (';
    pages.forEach(function(p){
        if(p[0] > 0){
            content += ', ';
        }
        let tips = trial_ids.slice(p[0], p[1]);
        content += '<a href="https://clinicaltrials.gov/ct2/results?show_xprt=Y&xprt=' + tips.join('+OR+')
                + `" target="_blank">${p[0]+1}-${p[1]}</a>`;
    });
    return content + ')';
}
