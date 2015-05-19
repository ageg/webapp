function postListFromTable (tableId, url) {
    var arr = [];
    var table = $("#" + tableId).get(0);
    for (var i = 1; i < table.rows.length; i++) {
        var item = {};
        for (var x = 0; x < table.rows[i].cells.length; x++) {
            var child = table.rows[i].cells[x].children[0];
            item[child.name] = child.value;
        }
        
        arr.push(item);
    }
    
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(arr),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        },
        failure: function (errMsg) {
            console.log(errMsg);
        },
        complete: function(data) {
            console.log(data);
        }
    });
}