$(document).ready(function(){

    startup();
    $('#search_btn').on('click', findDVDbyX);

    //$('#add_btn').on('click', addDVD);
    //$('#edit_btn').on('click', editDVD);
    //addDVD();

});

function startup(){
    $('#addView').hide();
    $('#editView').hide();
    $('#dvdView').hide();
    loadDVDs();
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function() {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}

function loadDVDs(){
    console.log("loadDVD entered");
    var contentRows = $('#contentRows');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/dvds',
        dataType: 'json',
        success: function(dvdArray){
            $.each(dvdArray, function(index, dvd){
                var dvdid = dvd.dvdid;

                var row = '<tr>';
                    row += '<td><button type="button" class="link" onclick="findDVD(' + dvdid + ')">' + dvd.title + '</button></td>';
                    row += '<td>' + dvd.releaseYear + '</td>';
                    row += '<td>' + dvd.director + '</td>';
                    row += '<td>' + dvd.rating + '</td>';
                    row += '<td><button type="button" class="link offset-md-2 col-md-2" onclick="editDVD(' + dvdid + ')">Edit</button>' + '| ' +
                           '<button type="button" class="link" onclick="deleteDVD(' + dvdid + ')"> Delete</button></td>' ;
                    row += '</tr>';
                contentRows.append(row);
            })
        },
        error: function(){
            $('#errorMessages')
                .append($('<li>'))
                .attr({class: 'list-group-item list-group-item-danger text-center'})
                .text('Error calling web service. Please try again later.');
        }
    })
}

function findDVDbyID(){
    var contentRows = $('#contentRows')
    var haveValidationErrors = checkAndDisplayValidationErrors($('#findForm').find('input'));
    if(haveValidationErrors) {return false;}
    $('#findForm').submit(function(dvdid){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/dvd/' + $("#select").val() + '/' + dvdid,
            dataType: 'json',
            success: function(){
                var newdvdid = dvd.dvdid;

                var row = '<tr>';
                    row += '<td><button type="button" class="link" onclick="findDVD(' + newdvdid + ')">' + dvd.title + '</button></td>';
                    row += '<td>' + dvd.releaseYear + '</td>';
                    row += '<td>' + dvd.director + '</td>';
                    row += '<td>' + dvd.rating + '</td>';
                    row += '<td><button type="button" class="link offset-md-2 col-md-2" onclick="editDVD(' + newdvdid + ')">Edit</button>' + '| ' +
                           '<button type="button" class="link" onclick="deleteDVD(' + newdvdid + ')"> Delete</button></td>' ;
                    row += '</tr>';
                contentRows.append(row);
            },
            error: function(){
                $('#errorMessages')
                    .append($('<li>'))
                    .attr({class: 'list-group-item list-group-item-danger text-center'})
                    .text('Search Category and Search Term are required fields.');
            }
        })
    })
}

function resetTable(){


}
// SEARCHES BY TITLE/RELEASEYEAR/DIRECTOR/RATING
function findDVDbyX(){
    var contentRows = $('#contentRows');
    contentRows.empty();
    var haveValidationErrors = checkAndDisplayValidationErrors($('#findForm').find('input'));
    if(haveValidationErrors) {return false;}
    $('#findForm').submit(function(event){
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/dvds/' + $('#select').val() + '/' + $('#searchTerm').val(), // replace dvdid with title/releaseYear/etc
            dataType: 'json',
            success: function(dvdArray){

                $.each(dvdArray, function(index, dvd){
                    var newdvdid = dvd.dvdid;

                    var row = '<tr>';
                        row += '<td><button type="button" class="link" onclick="findDVD(' + newdvdid + ')">' + dvd.title + '</button></td>';
                        row += '<td>' + dvd.releaseYear + '</td>';
                        row += '<td>' + dvd.director + '</td>';
                        row += '<td>' + dvd.rating + '</td>';
                        row += '<td><button type="button" class="link offset-md-2 col-md-2" onclick="editDVD(' + newdvdid + ')">Edit</button>' + '| ' +
                               '<button type="button" class="link" onclick="deleteDVD(' + newdvdid + ')"> Delete</button></td>' ;
                        row += '</tr>';
                    contentRows.append(row);
                })
            },
            error: function(){
                $('#errorMessages')
                    .append($('<li>'))
                    .attr({class: 'list-group-item list-group-item-danger text-center'})
                    .text('Search Category and Search Term are required fields.');
            }
        })
    })
}

function addDVD(){
    var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));
    if(haveValidationErrors) {return false;}
    $('#addForm').submit(function (event){
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/dvd',
            data: JSON.stringify({
                title: $('#addTitle').val(),
                releaseYear: parseInt($('#addReleaseYear').val(), 10),
                director: $('#addDirector').val(),
                rating: $('#addRating').val(),
                notes: $('#addNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function(){
            $('#errorMessages').empty();
            $('#addTitle').val('');
            $('#addReleaseYear').val('');
            $('#addDirector').val('');
            $('#addRating').val('');
            $('#addNotes').val('');
            },
            error: function(){
            }
        });
    })
}

function editDVD(dvdid){
    console.log("editDVD entered with id=" + dvdid);
    var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
    if(haveValidationErrors) {return false;}
    $('#editForm').submit(function (event){
        event.preventDefault();
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/api/dvd',
            data: JSON.stringify({
                title: $('#editTitle').val(),
                releaseYear: parseInt($('#editReleaseYear').val(), 10),
                director: $('#editDirector').val(),
                rating: $('#editRating').val(),
                notes: $('#editNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function(){
            $('#errorMessages').empty();
            $('#addTitle').val('');
            $('#addReleaseYear').val('');
            $('#addDirector').val('');
            $('#addRating').val('');
            $('#addNotes').val('');
            },
            error: function(){
            }
        });
    })
}

function deleteDVD(dvdid){
    console.log("deleteDVD entered");

}


