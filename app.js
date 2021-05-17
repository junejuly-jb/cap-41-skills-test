$('document').ready(function () {

    getBooks()
    var edited_index = -1
    var edited_id = 0

    var no_of_hardbounds = 0
    var no_of_softbounds = 0

    $("#btn_cancel").hide()

    // get all books, count of books, counts of hardbounds and softbounds
    function getBooks() {
        $.ajax({
            type: 'GET', // request type
            url: 'http://localhost:3000/books', //url callback
            success: function (data) { // success callback function
                //loop thru results
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type == 'softbound') {
                        no_of_softbounds++
                    }
                    else {
                        no_of_hardbounds++
                    }

                    // loop data to make a row
                    var rows = `
                        <tr class="tr_books">
                            <td>${data[i].isbn}</td>
                            <td>${data[i].title}</td>
                            <td>${data[i].author}</td>
                            <td>${data[i].copyright_year}</td>
                            <td>${data[i].publisher}</td>
                            <td>${data[i].price}</td>
                            <td>${data[i].type}</td>
                            <td>
                                <button value="${data[i].id}" type="button" id="btnDelete" class="btn btn-danger">Delete</button>
                                <button value="${data[i].id}" type="button" id="btnEdit" class="btn btn-success">Edit</button>
                            </td>
                        </tr>`
                    $('.t_body').append(rows) // append looped rows on table
                }
                // provide data to inputs on HTML
                $("#no_of_books").val(data.length)
                $('#no_of_hardbounds').val(no_of_hardbounds)
                $('#no_of_softbounds').val(no_of_softbounds)
            }
        })
    }


    // trigger button click when adding new book
    $("#btn_add").click(function () {
        var book = {
            isbn: $("#isbn").val(),
            title: $("#title").val(),
            author: $("#author").val(),
            copyright_year: $("#copyright_year").val(),
            publisher: $("#publisher").val(),
            price: $("#price").val(),
            type: $("#type").val(),
        }

        if ($(this).text() == 'Update') {
            $.ajax({
                type: "PUT",
                url: "http://localhost:3000/books/" + edited_id,
                data: book,
                success: function (data) {
                    formReset()
                    $("#btn_cancel").hide()
                    edited_index.find('td:nth-child(1)').text(data.isbn)
                    edited_index.find('td:nth-child(2)').text(data.title)
                    edited_index.find('td:nth-child(3)').text(data.author)
                    edited_index.find('td:nth-child(4)').text(data.copyright_year)
                    edited_index.find('td:nth-child(5)').text(data.publisher)
                    edited_index.find('td:nth-child(6)').text(data.price)
                    edited_index.find('td:nth-child(7)').text(data.type)
                    var hard_b = 0
                    var soft_b = 0
                    $('table#tblBooks > tbody.t_body > tr.tr_books').each(function (index, tr) {
                        if ($(this).closest('tr').find('td:nth-child(7)').text() == 'hardbound') {
                            hard_b++
                        }
                        else{
                            soft_b++
                        }
                    })
                    $("#no_of_hardbounds").val(hard_b)
                    $("#no_of_softbounds").val(soft_b)
                    $("#btn_add").text('Submit')
                },
                error: function (err) {
                    alert(err)
                    formReset()
                }
            })
        }
        else {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/books",
                data: book,
                success: function (data) {
                    if (data.type == 'hardbound') {
                        $("#no_of_hardbounds").val(+$("#no_of_hardbounds").val() + 1)
                    }
                    else {
                        $("#no_of_softbounds").val(+$("#no_of_softbounds").val() + 1)
                    }
                    $("#no_of_books").val(+$("#no_of_books").val() + 1)

                    var row = `
                    <tr class="tr_books">
                        <td>${data.isbn}</td>
                        <td>${data.title}</td>
                        <td>${data.author}</td>
                        <td>${data.copyright_year}</td>
                        <td>${data.publisher}</td>
                        <td>${data.price}</td>
                        <td>${data.type}</td>
                        <td>
                            <button value="${data.id}" type="button" id="btnDelete" class="btn btn-danger">Delete</button>
                            <button value="${data.id}" type="button" id="btnEdit" class="btn btn-success">Edit</button>
                        </td>
                    </tr>
                `
                    $('.t_body').append(row)
                    formReset()
                },
                error: function (err) {
                    alert(err)
                    formReset()
                }
            })
        }
    })

    // trigger delete button
    $('table#tblBooks > tbody.t_body').on('click', '#btnDelete', function () {
        var id = $(this).attr('value')
        var row = $(this).closest('tr')
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/books/' + id,
            success: function () {
                row.remove()
                if (row.find('td:nth-child(7)').text() == 'hardbound') {
                    $("#no_of_hardbounds").val(+$("#no_of_hardbounds").val() - 1)
                }
                else {
                    $("#no_of_softbounds").val(+$("#no_of_softbounds").val() - 1)
                }
                $("#no_of_books").val(+$("#no_of_books").val() - 1)
            },
            error(err) {
                console.log(err)
            }
        })
    })

    $('table#tblBooks > tbody.t_body').on('click', '#btnEdit', function () {
        edited_id = $(this).attr('value')
        edited_index = $(this).closest('tr')
        $('#btn_add').text('Update')
        $('#btn_cancel').show()
        $("#isbn").val($(this).closest('tr').find('td:nth-child(1)').text())
        $("#title").val($(this).closest('tr').find('td:nth-child(2)').text())
        $("#author").val($(this).closest('tr').find('td:nth-child(3)').text())
        $("#copyright_year").val($(this).closest('tr').find('td:nth-child(4)').text())
        $("#publisher").val($(this).closest('tr').find('td:nth-child(5)').text())
        $("#price").val($(this).closest('tr').find('td:nth-child(6)').text())
        $("#type").val($(this).closest('tr').find('td:nth-child(7)').text()).change()
    })

    $("#btn_cancel").click(function () {
        formReset()
        $(this).hide()
        $("#btn_add").text("Submit")
    })

    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase()
        $("#tblBooks tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    })

    // call this function to reset form data
    function formReset() {
        $("#isbn").val('')
        $("#title").val('')
        $("#author").val('')
        $("#copyright_year").val('')
        $("#publisher").val('')
        $("#price").val('')
        $("#type").val('0')
    }
})