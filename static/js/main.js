$(document).ready(function () {
    $('#back').click(function(e){
        window.location.href="/";
    });

    $('#group-save').click(function(e){
        e.preventDefault();
        isok = 1;
        $('.textarea-label').each(function(){
            $('.form-error-message p', $(this).parent()).hide();
            if($(this).val().length == 0) {
                $(this).addClass('errorBorder');
                $('.form-error-message p', $(this).parent()).eq(0).show();
                $(this).next().show();
                isok = 0;
            }else if ($(this).val().length != 0 && $(this).val() == $(this).attr('prev_answer')){
                index = $('.textarea-label').index($(this));
                if (($('p.questions-p')[index].innerText).trim().toLowerCase() != 'do you like to snowboard?'){
                    $(this).addClass('errorBorder');
                    $('.form-error-message p', $(this).parent()).eq(1).show();
                    $(this).next().show();
                    isok = 0;
                }
            }
            else{
                $(this).removeClass('errorBorder');
                $(this).next().hide();
            }
        });
        if(isok == 1)
            $('#groupform').submit();
    });

    /* Edit Response in Summery Page */
    $('.response-edit').each(function(){
        $(this).on("focus", function( e ) {
            $('#edit-button').show();
        })
    });
});

/* Convert the Tabel data to CSV Data */
function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 4; j < 6; j++) {
            if (cols[j].childElementCount > 0) {
                row.push(cols[j].firstChild.value);
            }else{
                row.push(cols[j].innerText);
            }
        }
        csv.push(row.join(","));
    }

    // Download CSV file
    downloadFile(csv.join("\n"), filename);
}

/* Download File */
function downloadFile(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

/* Convert the Tabel data to JSON Data */
function exportTableToJSON(filename) {
    var myJSON = [];

    var headers = $('table th');
    $('table tbody tr').each(function(i, tr){
        var obj = {},

        $tds = $(tr).find('td');

        headers.each(function(index, header){
            var key = $(header).text();

            if (key == 'OutPutLabel'){
                obj[key] = $tds.eq(index).text();
            }
            else if (key == 'Response'){
                obj[key] = $tds.eq(index).find('textarea').val();
            }
        });
        myJSON.push(obj);
    });
    myJSON.shift()
    JSON.stringify(myJSON);

    // Download JSON file
    downloadFile(JSON.stringify(myJSON), filename);
}
