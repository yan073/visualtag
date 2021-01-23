var adjacent;
var todo_cells;
var high_priority_todo;
var colormap;
var adjacent_colors;
var colored;
var coloring_option_stack;
let num_color_space = 4;

function set_leaf_color() {
    todo_cells = [];
    high_priority_todo = [];    
    colormap = {};
    adjacent_colors = {};
    colored =[];
    coloring_option_stack = [];

    let leaves = document.querySelectorAll('[data-cluster]');
    adjacent = find_adjacents(leaves);

    set_color_to_cell(0, 'leaf', leaves);
    while( (todo_cells.length >0 || high_priority_todo.length >0)) {
        let next = high_priority_todo.length >0 ? high_priority_todo.shift() : todo_cells.shift(); 
        set_color_to_cell(next, 'leaf', leaves)
    }
    console.log('option stack length = ' + coloring_option_stack.length);
}

function stack_coloring_option(current, colouring_option){
    var context = {}
    context['todo_cells'] = [...todo_cells];
    context['high_priority_todo'] = [...high_priority_todo];
    context['colored'] = [...colored];
    context['colormap'] = {};
    for(var key in colormap) {
        context['colormap'][key] = colormap[key];
    }
    context['adjacent_colors'] = {};
    for(var key in adjacent_colors) {
        context['adjacent_colors'][key] = [...adjacent_colors[key]];
    }
    context['current'] = current;
    context['colouring_option'] = colouring_option;
    coloring_option_stack.push(context);
}

function set_color_to_cell(current, cat, leaves){
    if (colored.indexOf(current)<0) {
        var cluster = leaves[current].getAttribute('data-cluster');
        if (cluster == null) {
            cluster = leaves[current].getAttribute('transform');
        }
        var new_c;
        if (cluster == 'unknown') {
            new_c = 5;
        }
        else {
            let diffcs = get_diff_color(adjacent_colors[cluster]);
            if (diffcs.length > 0) {
                new_c = diffcs[0];
                for(var i = 0; i<diffcs.length ; i++) {
                    stack_coloring_option(current, diffcs[i]);
                }
            }
            else {
                console.log('Could not find a colour different from adjacent cells.');
                new_c = 1;
            }
        }
        colored.push(current);
        colormap [current] = new_c;
        let colorclass = cat + 'c1_' + new_c;
        leaves[current].classList.add( colorclass );
        let siblings = get_cells_in_same_cluster(cluster, leaves);
        for(var i=0;i<siblings.length;i++){
            let next = siblings[i];
            if (next != current) {
                colormap[next] = new_c;
                colored.push(next);
                leaves[next].classList.add( colorclass );
            }
        }
        for(var i=0;i<siblings.length;i++){
            process_neighbor_after_coloring(siblings[i], new_c, cluster, leaves);
        }
    }
}

function get_cells_in_same_cluster(cluster, leaves){
    let samel = [];
    if (cluster != null && cluster.length >0) {
        for(var i = 0; i< leaves.length; i++) {
            var nl = leaves[i].getAttribute('data-cluster');
            if (nl==null) {
                nl = leaves[i].getAttribute('transform');
            }
            if (cluster == nl) {
                samel.push(i);
            }
        }
    }
    return samel;
}

function process_neighbor_after_coloring(current, color, cluster, leaves){
    let adjs = adjacent[current];
    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        let elem = leaves[neighbor];
        var sibl2 = elem.getAttribute('data-cluster');
        if (sibl2 == null) {
            sibl2 = elem.getAttribute('transform');
        }
        if (sibl2 != cluster) {
            if (!(sibl2 in adjacent_colors)) {
                adjacent_colors[sibl2] = [];
            }
            if (adjacent_colors[sibl2].indexOf(color) <0) {
                adjacent_colors[sibl2].push(color);
            }
        }
    }

    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        if(colored.indexOf(neighbor) < 0){
            let elem = leaves[neighbor];
            var sibl2 = elem.getAttribute('data-cluster');
            if (sibl2 == null) {
                sibl2 = elem.getAttribute('transform');
            }
            if (adjacent_colors[sibl2].length >= 3) {
                high_priority_todo.unshift(neighbor);
            }
            else if (adjacent_colors[sibl2].length == 2) {
                if(high_priority_todo.indexOf(neighbor) <0) {
                    high_priority_todo.push(neighbor);
                }
            }
            else {
                if (todo_cells.indexOf(neighbor) <0) {
                    todo_cells.push(neighbor);
                }
            }
        }
    }

}

