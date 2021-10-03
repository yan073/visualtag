function query_zenodo_json_file(recid, filename, querier, callback) {
    query_zenodo_latest_version(recid, filename, querier, function(error, url) {
        querier(url, function(error, data) {
            callback(error, data);
        });
    });
}

function query_zenodo_latest_version(recid, filename, querier, callback){
    querier("https://zenodo.org/api/records/" + recid, function(error, data1) {
        querier(data1.links.latest, function(error, data2) {
            fobj = data2.files.find(f => f.filename === filename);
            callback(error, fobj.links.download);
        });
    });
}

function query_zenodo_csv_file(recid, filename, jsonqr, csvqr, callback) {
    query_zenodo_latest_version(recid, filename, jsonqr, function(error, url) {
        csvqr(url, function(error, data) {
            callback(error, data);
        });
    });
}