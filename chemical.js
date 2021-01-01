var adjacent;

function set_leaf_color() {
    let leaves = document.querySelectorAll('[data-cluster]');
    adjacent = find_adjacents(leaves);
}