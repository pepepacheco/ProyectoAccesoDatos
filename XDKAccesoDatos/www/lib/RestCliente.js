$.cliente={};

$.cliente.HOST = 'http://localhost:8080/';
$.cliente.URL = 'ProyectoTienda1/webresources/com.iesvdc.acceso.entidades.cliente/';

$.cliente.ClienteRead = function(){
    $.ajax({
        url: this.HOST+this.URL,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            $('#r_cliente').empty();
            $('#r_cliente').append('<h3>Listado de Alumnos</h3>');
            var table = $('<table />').addClass('table table-stripped');

            table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>','<th>email</th>')));
            var tbody = $('<tbody />');
            for (var clave in json) {
                tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                            '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellidos + '</td>', '<td>' + json[clave].email + '</td>'));
            }
            table.append(tbody);

            $('#r_cliente').append( $('<div />').append(table) );
            $('tr:odd').css('background','#CCCCCC');
        },
        error: function (xhr, status) {
             $.alumno.error('Imposible leer cliente','Compruebe su conexión e inténtelo de nuevo más tarde');
        }
});
};
$.cliente.ClienteCreate = function(){
    // Leemos los datos del formulario pidiendo a jQuery que nos de el valor de cada input.
    var datos = {
        'nombre' : $("#c_al_nombre").val(),
        'apellidos': $("#c_al_apellidos").val(),
        'email': $("#c_al_email").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.apellidos.length>2 && datos.email.length>2) {
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.cliente.ClienteRead();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#r_cliente",false,false,"up");
    }
    
};
$.cliente.ClienteDelete = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
        id = $('#d_cl_sel').val();
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.cliente.ClienteRead();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_cliente",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Delete','No ha sido posible borrar el alumno. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_cliente').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var div_select = $('<div />');
                div_select.addClass('form-group');
                var select = $('<select id="d_cl_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].apellidos+ ' ' + json[clave].email+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="form-group"></div>').append('<div class="btn btn-danger" onclick="$.cliente.ClienteDelete(1)"> eliminar! </div>');
                $('#d_cliente').append(formulario);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};
$.cliente.ClienteUpdate = function(id, envio){
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_cliente').empty();
                $('#u_cliente').append('<h3>Pulse sobre un alumno</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>','<th>email</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.cliente.ClienteUpdate('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellidos + '</td>', '<td>' + json[clave].email + '</td>'));
                }
                table.append(tbody);

                $('#u_cliente').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.cliente.error('Error: Cliente Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var cl_id = ($(seleccion))[0];
        var cl_nombre = ($(seleccion))[1];
        var cl_apellidos = ($(seleccion))[2];
        var cl_email = ($(seleccion))[3];
        
        $("#u_cl_id").val(cl_id.childNodes[0].data);
        $("#u_cl_nombre").val(cl_nombre.childNodes[0].data);
        $("#u_cl_apellidos").val(cl_apellidos.childNodes[0].data);
        $("#u_cl_email").val(cl_email.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#uf_cliente",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'id' : $("#u_cl_id").val(),
                'nombre' : $("#u_cl_nombre").val(),
                'apellidos': $("#u_cl_apellidos").val(),
                'email': $("#u_cl_email").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.apellidos.length>2 ) {
                $.ajax({
                    url: $.cliente.HOST+$.cliente.URL+'/'+$("#u_cl_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.cliente.ClienteRead();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.cliente.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_cliente",false,false,"up");
            }
    }
};

