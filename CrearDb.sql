drop table if exists clientes;
drop table if exists productos;
drop database if exists tienda;
drop user if exists 'admin'@'localhost';

Create database tienda;
use tienda;
create user 'admin'@'localhost' identified by 'admin';
grant all privileges on tienda.* to 'admin'@'localhost';

create table cliente(
id int(9) auto_increment primary key ,
nombre varchar(15) not null,
apellidos varchar(30) not null,
email varchar(50)
);

create table producto(
id int(9) auto_increment primary key ,
nombre varchar(40) not null,
marca varchar(20) not null,
cantidad int(6)
);

