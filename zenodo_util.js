function query_zenodo_json_file(recid, filename, callback) {
    d3.json("https://zenodo.org/api/records/" + recid, function(error, data1) {
        d3.json(data1.links.latest, function(error, data2) {
            fobj = data2.files.find(f => f.filename === filename);
            d3.json(fobj.links.download, function(error, data3) {
                callback(error, data3);
            });
        });
    });
}