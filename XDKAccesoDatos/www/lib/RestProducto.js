$.producto={};

$.producto.HOST = 'http://localhost:8080/';
$.producto.URL = 'ProyectoTienda1/webresources/com.iesvdc.acceso.entidades.producto/';
$.producto.ProductoRead = function(){
    $.ajax({
        url: this.HOST+this.URL,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            $('#r_productos').empty();
            $('#r_productos').append('<h3>Listado de Productos</h3>');
            var table = $('<table />').addClass('table table-stripped');

            table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>marca</th>','<th>cantidad</th>')));
            var tbody = $('<tbody />');
            for (var clave in json) {
                tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                            '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].marca + '</td>', '<td>' + json[clave].cantidad + '</td>'));
            }
            table.append(tbody);

            $('#r_productos').append( $('<div />').append(table) );
            $('tr:odd').css('background','#CCCCCC');
        },
        error: function (xhr, status) {
             $.producto.error('Imposible leer cliente','Compruebe su conexión e inténtelo de nuevo más tarde');
        }
});
};
$.producto.ProductoCreate = function(){
    // Leemos los datos del formulario pidiendo a jQuery que nos de el valor de cada input.
    var datos = {
        'nombre' : $("#c_pr_nombre").val(),
        'marca': $("#c_pr_marca").val(),
        'cantidad': $("#c_pr_cantidad").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.marca.length>2 && datos.cantidad > -1) {
        $.ajax({
            url: $.producto.HOST+$.producto.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.producto.ProductoRead();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.produto.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#r_productos",false,false,"up");
    }
    
};
$.producto.ProductoDelete = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
        id = $('#d_pr_sel').val();
        $.ajax({
            url: $.producto.HOST+$.producto.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.producto.ProductoRead();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_productos",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.producto.error('Error: Cliente Delete','No ha sido posible borrar el alumno. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_producto').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var div_select = $('<div />');
                div_select.addClass('form-group');
                var select = $('<select id="d_pr_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].marca+ ' ' + json[clave].cantidad+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="form-group"></div>').append('<div class="btn btn-danger" onclick="$.producto.ProductoDelete(1)"> eliminar! </div>');
                $('#d_producto').append(formulario);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Producto Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};
$.producto.ProductoUpdate = function(id, envio){
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_producto').empty();
                $('#u_producto').append('<h3>Pulse sobre un producto</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>marca</th>','<th>cantidad</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.producto.ProductoUpdate('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].marca + '</td>', '<td>' + json[clave].cantidad + '</td>'));
                }
                table.append(tbody);

                $('#u_producto').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.producto.error('Error: Cliente Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var pr_id = ($(seleccion))[0];
        var pr_nombre = ($(seleccion))[1];
        var pr_marca = ($(seleccion))[2];
        var pr_cantidad = ($(seleccion))[3];
        
        $("#u_pr_id").val(pr_id.childNodes[0].data);
        $("#u_pr_nombre").val(pr_nombre.childNodes[0].data);
        $("#u_pr_marca").val(pr_marca.childNodes[0].data);
        $("#u_pr_cantidad").val(pr_cantidad.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#uf_producto",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'id' : $("#u_pr_id").val(),
                'nombre' : $("#u_pr_nombre").val(),
                'marca': $("#u_pr_marca").val(),
                'cantidad': $("#u_pr_cantidad").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.marca.length>2 ) {
                $.ajax({
                    url: $.producto.HOST+$.producto.URL+$("#u_pr_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.producto.ProductoRead();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.cliente.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_producto",false,false,"up");
            }
    }
};