function query_zenodo_json_file(recid, filename, querier, callback) {
    querier("https://zenodo.org/api/records/" + recid, function(error, data1) {
        querier(data1.links.latest, function(error, data2) {
            fobj = data2.files.find(f => f.filename === filename);
            querier(fobj.links.download, function(error, data3) {
                callback(error, data3);
            });
        });
    });
}