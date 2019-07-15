
angular.module('app.sqliteServices', [])

.factory('sqliteServices', function ($http,$q,$cordovaSQLite,$timeout,$cordovaFile) {

  var Result = {};
  Result.limpiarTablas = function(){
    var q = $q.defer();
   $cordovaSQLite.execute(db,"drop table tbl_suministro").then(function(){
   $cordovaSQLite.execute(db,"drop table tbl_suministro_foto").then(function(){    
   $cordovaSQLite.execute(db,"drop table TBL_Registros").then(function(){   
   $cordovaSQLite.execute(db,"drop table TBL_Registro_Foto").then(function(){   
   $cordovaSQLite.execute(db,"drop table TBL_Detalle_Grupo").then(function(){
   $cordovaSQLite.execute(db,"drop table TBL_Parametros").then(function(){
   $cordovaSQLite.execute(db,"drop table TBL_Operarios_RegistroGPS").then(function(){
   $cordovaSQLite.execute(db,"drop table TBL_ReporteDiario_Foto").then(function(){
   $cordovaSQLite.execute(db,"drop table TBL_ReporteDiario").then(function(){
   $cordovaSQLite.execute(db,"drop table Tbl_TipoReporteDiario").then(function(){
   $cordovaSQLite.execute(db,"drop table tbl_EstadoCelular").then(function(){
    
      Result.createTables().then(function(){        
        q.resolve('success');
      })
   })})})})})})})})})})});
   return q.promise;
  }
  var getFotosBack = function(){
   var jsonResult = [];          
            var query = "SELECT * FROM TBL_Registro_Foto_Back"
            var q = $q.defer();
            $cordovaSQLite.execute(db,query).then(function(result){
              for (var i = 0; i < result.rows.length; i++) {       
                jsonResult.push(result.rows.item(i))
              }
              q.resolve(jsonResult)
            }, function(error){
              q.reject(error)
            })
            return q.promise;    
  }
  Result.limpiarTablasAll = function(){
    var q = $q.defer();        
           getFotosBack().then(function(res){            
            if (res.length> 0) {
              res.forEach(function(item,index){                
                 $cordovaFile.removeFile(cordova.file.externalRootDirectory + 'LECTURASLDS/', item.RutaFoto)
                 .then(function (success) {                      
                   }, function (error) {
                             
                   });
              })
            }
           })
           Result.deleteRegistrosBackByDate();
           Result.deleteSuministroBackByDate();
           $cordovaSQLite.execute(db,"drop table tbl_suministro").then(function(){
            $cordovaSQLite.execute(db,"drop table tbl_suministro_foto").then(function(){            
           $cordovaSQLite.execute(db,"drop table TBL_Registros").then(function(){           
           $cordovaSQLite.execute(db,"drop table TBL_Registro_Foto").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_Registro_Foto_Back").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_Detalle_Grupo").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_Parametros").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_Operarios_RegistroGPS").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_ReporteDiario_Foto").then(function(){
           $cordovaSQLite.execute(db,"drop table TBL_ReporteDiario").then(function(){
           $cordovaSQLite.execute(db,"drop table Tbl_TipoReporteDiario").then(function(){
           $cordovaSQLite.execute(db,"drop table tbl_EstadoCelular").then(function(){                
              Result.createTables().then(function(){
                
                q.resolve('success');
              })
           })})})})})})})})})})})});
 

   return q.promise;
  }  

  Result.createTables = function(){
      var q = $q.defer();  
     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_suministro(id integer primary key autoincrement,"
      + "ID_Suministro integer,"
      + "Suministro_Numero integer,"
      + "Suministro_Medidor integer,"
      + "Suministro_Cliente text,"
      + "Suministro_Direccion text,"
      + "Suministro_dns text,"
      + "Suministro_LecturaMinima text,"
      + "Suministro_LecturaMaxima text,"
      + "ConsumoPromedio text,"
      + "LecturaAnterior text,"
      + "id_Operario integer,"
      + "SuministroOrden integer,"
      + "r1_lectura text,"
      + "s1_lectura text,"
      + "estado text,"
      + "Suministro_Latitud text,"
      + "Suministro_Longitud text,"
      + "Suministro_CantidadDigitos text,"
      + "Suministro_TipoProceso integer,"
      + "flagSelfie text,"
      + "aledano_1 text,"
      + "aledano_2 text,"
      + "cliente_vip int,"
      + "Suministro_Sector text,"
      + "PorceCalculo text,"
      + "Inicial text,"
      + "ConsumoAnterior text)").then(function(){

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_suministro_foto(id integer primary key autoincrement,"
      + "ID_Suministro integer,"
      + "Suministro_Numero integer,"
      + "Suministro_Medidor integer,"
      + "Suministro_Cliente text,"
      + "Suministro_Direccion text,"
      + "Suministro_dns text,"
      + "Suministro_LecturaMinima text,"
      + "Suministro_LecturaMaxima text,"
      + "ConsumoPromedio text,"
      + "LecturaAnterior text,"
      + "id_Operario integer,"
      + "SuministroOrden integer,"
      + "r1_lectura text,"
      + "s1_lectura text,"
      + "estado text,"
      + "Suministro_Latitud text,"
      + "Suministro_Longitud text,"
      + "Suministro_CantidadDigitos text,"
      + "Suministro_TipoProceso integer,"
      + "flagSelfie text,"
      + "ID_General text,"
      + "aledano_1 text,"      
      + "aledano_2 text,"
      + "estado_general text)").then(function(){        

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Registros(id integer primary key autoincrement,"
      + "ID_Suministro integer,"
      + "ID_TipoLectura integer,"
      + "Registro_Fecha_SQLITE text,"      
      + "Registro_Latitud text,"
      + "Registro_Longitud text,"
      + "Registro_Lectura text,"
      + "Registro_Confirmar_Lectura text,"
      + "Registro_Observacion text,"
      + "Grupo_Incidencia_Codigo text,"
      + "Registro_dns text,"
      + "Registro_Ubicacion text,"
      + "Registro_TieneFoto integer,"
      + "ID_General text,"
      + "Registro_Medidor text)").then(function(){

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Registros_back(id integer primary key autoincrement,"
      + "ID_Suministro integer,"
      + "ID_TipoLectura integer,"
      + "Registro_Fecha_SQLITE text,"      
      + "Registro_Latitud text,"
      + "Registro_Longitud text,"
      + "Registro_Lectura text,"
      + "Registro_Confirmar_Lectura text,"
      + "Registro_Observacion text,"
      + "Grupo_Incidencia_Codigo text,"
      + "Registro_dns text,"
      + "Registro_Ubicacion text,"
      + "Registro_TieneFoto integer,"
      + "ID_General text,"
      + "Registro_Medidor text)").then(function(){        

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Registro_Foto(id integer primary key autoincrement,"
      + "ID_Registro integer,"
      + "RutaFoto text,"
      + "Fecha_Sincronizacion_Android text,"
      + "ID_General text,"
      + "urlFoto text,"
      + "flag_prioridad text)").then(function(){

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Registro_Foto_Back(id integer primary key autoincrement,"
      + "ID_Registro integer,"
      + "RutaFoto text,"
      + "Fecha_Sincronizacion_Android text,"
      + "ID_General text,"
      + "urlFoto text,"
      + "flag_prioridad text)").then(function(){        

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Detalle_Grupo(id integer primary key autoincrement,"
      + "ID_DetalleGrupo integer,"
      + "Grupo integer,"
      + "Codigo text,"
      + "Descripcion text,"
      + "Abreviatura text,"
      + "PideFoto integer,"
      + "PideLectura integer)")  
     

      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Parametros(id integer primary key autoincrement,"                     
       + "nombre_parametro text,"
       + "valor integer)").then(function(){

      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_Operarios_RegistroGPS(id integer primary key autoincrement,"
       + "id_operario integer,"
       + "GPS_Latitud text,"
       + "GPS_Longitud text,"       
       + "fecha_Android text)").then(function(){

      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_EstadoCelular(id integer primary key autoincrement,"
       + "id_operario integer,"
       + "GpsActivo integer,"
       + "estadoBateria integer,"              
       + "FechaHoraAndroid integer,"  
       + "ModoAvion integer,"  
       + "PlanDatos integer)").then(function(){

      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_ReporteDiario(id integer primary key autoincrement,"
       + "id_TipoReporte integer,"
       + "id_TipoReporteDiario integer,"
       + "Obs_reporteDiario text,"              
       + "latitud_reporteDiario text,"  
       + "longitud_reporteDiario text,"  
       + "id_Operario integer,"  
       + "estado integer,"       
       + "id_general text)").then(function(){

      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TBL_ReporteDiario_Foto(id integer primary key autoincrement,"
       + "id_ReporteDiario integer,"       
       + "fotourl text,"
       + "id_general text,"
       + "urlFoto text)").then(function(){

     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_suministro_back(id integer primary key autoincrement,"
       + "lectura text,"       
       + "device text,"
       + "id_device text,"
       + "suministro text,"
       + "fecha_movil text,"
       + "id_operario int)").then(function(){


      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Tbl_TipoReporteDiario(id integer primary key autoincrement,"
       + "id_TipoReporteDiario integer,"       
       + "nombre_TipoReporteDiario text,"
       + "orden_TipoReporteDiario integer,"
       + "Alerta_TipoReporteDiario integer)").then(function(){
          q.resolve('success');
        })})})})})})})})})})})})});
      return q.promise;
      };


      /* METODOS CRUD TBL_PARAMETROS */
    Result.getTbl_EstadoCelular = function(cant){
        var jsonResult = [];        
        var query = "SELECT * FROM tbl_EstadoCelular"
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }
   Result.deleteTbl_EstadoCelular = function(){
        var q = $q.defer();
        var query = "DELETE FROM tbl_EstadoCelular";
        $cordovaSQLite.execute(db,query).then(function(res){
          q.resolve(res);
        },function(err){
          q.reject(err);
        })
        return q.promise
    }          
    Result.saveTbl_EstadoCelular = function(params){
        var q = $q.defer();
        var query = "INSERT INTO tbl_EstadoCelular VALUES(null,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db,query,params).then(function(res){          
          q.resolve(res);
        },function(err){          
          q.reject(err);
        })
        return q.promise       
    }
    
    Result.saveTbl_Suministro_Back = function(params){
        var q = $q.defer();
        q.resolve('success');
/*        var params = convertObjectA(params);
        var query = "INSERT INTO tbl_suministro_back VALUES(null,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db,query,params).then(function(res){          
          q.resolve(res);
        },function(err){          
          q.reject(err);
        })*/
        return q.promise       
    }    
    Result.saveTBL_ReporteDiario = function(params){
        var q = $q.defer();
        var params = convertObjectA(params);
        var query = "INSERT INTO TBL_ReporteDiario VALUES(null,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db,query,params).then(function(res){          
          q.resolve(res);
        },function(err){          
          q.reject(err);
        })
        return q.promise       
    }
    Result.deleteTBL_ReporteDiario = function(){
        var q = $q.defer();
        var query = "DELETE FROM TBL_ReporteDiario";
        $cordovaSQLite.execute(db,query).then(function(res){
          q.resolve(res);
        },function(err){
          q.reject(err);
        })
        return q.promise
    }
    Result.getTBL_ReporteDiario = function(){      
        var jsonResult = [];         
        var query = "SELECT * FROM TBL_ReporteDiario";
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){          
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }          
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }
    Result.deleteTBL_ReporteDiario_Foto = function(){
        var q = $q.defer();
        var query = "DELETE FROM TBL_ReporteDiario_Foto";
        $cordovaSQLite.execute(db,query).then(function(res){
          q.resolve(res);
        },function(err){
          q.reject(err);
        })
        return q.promise
    }
    Result.getTBL_ReporteDiario_Foto = function(){      
        var jsonResult = [];         
        var query = "SELECT * FROM TBL_ReporteDiario_Foto";
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){          
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }          
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }            
    Result.saveTBL_ReporteDiario_Foto = function(params){
        var q = $q.defer();
        var params = convertObjectA(params);
        var query = "INSERT INTO TBL_ReporteDiario_Foto VALUES(null,?,?,?,?)";
        $cordovaSQLite.execute(db,query,params).then(function(res){          
          q.resolve(res);
        },function(err){          
          q.reject(err);
        })
        return q.promise       
    }     

             
    Result.savetbl_parametros = function(data){
      var values = "";
      var count = 0;
      angular.forEach(data,function(item,index){
          values += "'" + item.nombre_parametro + "','" + item.valor  + "' UNION ALL SELECT "  
      })
      values = values.substring(0,values.length-17);                
      var q = $q.defer();
      Result.deletetbl_parametros().then(function(){
         var query = "INSERT INTO TBL_Parametros (nombre_parametro,valor) SELECT " + values;
          $cordovaSQLite.execute(db, query).then(function(res){              
           q.resolve(res);
          },function(err){            
            q.reject(err);
          })
      })

         return q.promise;

    }
             
    Result.saveTbl_TipoReporteDiario = function(data){
      var values = "";
      var count = 0;
      angular.forEach(data,function(item,index){
          values += "'" + item.id_TipoReporteDiario + "','" + item.nombre_TipoReporteDiario + "','" + item.orden_TipoReporteDiario  + "','" + item.Alerta_TipoReporteDiario  + "' UNION ALL SELECT "  
      })
      values = values.substring(0,values.length-17);                
      var q = $q.defer();
      Result.deleteTbl_TipoReporteDiario().then(function(){
         var query = "INSERT INTO Tbl_TipoReporteDiario (id_TipoReporteDiario,nombre_TipoReporteDiario,orden_TipoReporteDiario,Alerta_TipoReporteDiario) SELECT " + values;
          $cordovaSQLite.execute(db, query).then(function(res){              
           q.resolve(res);
          },function(err){            
            q.reject(err);
          })
      })

         return q.promise;

    } 
      Result.getTbl_TipoReporteDiario = function(){
        
          var jsonResult = [];                    
          var query = "SELECT id_TipoReporteDiario id, nombre_TipoReporteDiario des FROM Tbl_TipoReporteDiario"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }

    Result.deleteTbl_TipoReporteDiario = function(){
        var q = $q.defer();
        var query = "DELETE FROM Tbl_TipoReporteDiario"; // SOLO ELIMINA LOS FACTURADOS AL VOLVER A SINCRONIZAR , PARA CARGAR NUEVAMENTE 
        $cordovaSQLite.execute(db,query).then(function(res){
          q.resolve(res);
        },function(err){
          q.reject(err);
        })
        return q.promise
    }

    Result.deletetbl_parametros = function(){
        var q = $q.defer();
        var query = "DELETE FROM TBL_Parametros"; // SOLO ELIMINA LOS FACTURADOS AL VOLVER A SINCRONIZAR , PARA CARGAR NUEVAMENTE 
        $cordovaSQLite.execute(db,query).then(function(res){
          q.resolve(res);
        },function(err){
          q.reject(err);
        })
        return q.promise
    }
    Result.getTbl_Parametros = function(){      
        var jsonResult = [];         
        var query = "SELECT * FROM TBL_Parametros";
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){          
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }          
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }  

    Result.getTbl_ParametrosById = function(id){      
        var jsonResult = [];         
        var query = "SELECT * FROM TBL_Parametros WHERE id = " + id + "";
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){          
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }          
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }  

      Result.getTBL_Operarios_RegistroGPS = function(){
        var jsonResult = [];        
        var query = "SELECT * FROM TBL_Operarios_RegistroGPS"
        var q = $q.defer();
        $cordovaSQLite.execute(db,query).then(function(result){
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }
     Result.deleteTBL_Operarios_RegistroGPS = function(){
          var q = $q.defer();
          var query = "DELETE FROM TBL_Operarios_RegistroGPS";
          $cordovaSQLite.execute(db,query).then(function(res){
            q.resolve(res);
          },function(err){
            q.reject(err);
          })
          return q.promise
      }
    Result.saveTBL_Operarios_RegistroGPS = function(params){
        var q = $q.defer();
        var query = "INSERT INTO TBL_Operarios_RegistroGPS VALUES(null,?,?,?,?)";
        $cordovaSQLite.execute(db,query,params).then(function(res){         
          q.resolve(res);
        },function(err){
          
          q.reject(err);
        })
        return q.promise;
    }
      /* METODOS CRUD TBL_REGISTORS */

      Result.saveTbl_Registros_Foto = function(data){
          var q = $q.defer();
          var values ="";
          var i = 0;  
          if (data.length == 0) {
            q.resolve('success')
          }
          angular.forEach(data,function(item,index){
            i++;
            values += "'" + item.ID_Registro + "','" + item.RutaFoto + "','"
                   + item.Fecha_Sincronizacion_Android + "','" + item.ID_General + "','" + item.urlFoto + "','" + item.flag_prioridad + "' UNION ALL SELECT ";
          });
          values = values.substring(0,values.length-17);
          Result.saveTbl_Registros_FotoAux(values).then(function(res){
            console.log('okinsert',res);
            q.resolve({ status : 'success' , cantidad: data.length });
          },function(err){
            console.log('errorinsert',err);
            q.reject(err);
          });
          return q.promise;

        }
      Result.saveTbl_Registros_FotoAux = function(values){
          var q = $q.defer();          
          var query = "INSERT INTO TBL_Registro_Foto (ID_Registro,RutaFoto,Fecha_Sincronizacion_Android,ID_General,urlFoto,flag_prioridad) " +
                    "SELECT " + values;
           $cordovaSQLite.execute(db, query).then(function(res){            
            q.resolve(res);
           },function(err){
            q.reject(err);
           })
           return q.promise;
        }
      Result.saveTbl_Registros_Foto_Back = function(data){
          var q = $q.defer();
          var values ="";
          var i = 0;  
          if (data.length == 0) {
            q.resolve('success')
          }
          angular.forEach(data,function(item,index){
            i++;
            values += "'" + item.ID_Registro + "','" + item.RutaFoto + "','"
                   + item.Fecha_Sincronizacion_Android + "','" + item.ID_General + "','" + item.urlFoto + "','" + item.flag_prioridad + "' UNION ALL SELECT ";
          });
          values = values.substring(0,values.length-17);
          Result.saveTbl_Registros_FotoAux_back(values).then(function(){
            q.resolve({ status : 'success' , cantidad: data.length });
          },function(err){
            q.reject(err);
          });
          return q.promise;

        }         
      Result.updateTbl_suministro_flagSelfie = function(id){
          var q = $q.defer();          
          var params = [id];
          var query = "UPDATE tbl_suministro SET flagSelfie = 'null' WHERE id = ?";
           $cordovaSQLite.execute(db, query,params).then(function(res){            
            q.resolve(res);
           },function(err){
            q.reject(err);
           })
           return q.promise;
        }         
      Result.saveTbl_Registros_FotoAux_back = function(values){
          var q = $q.defer();          
          var query = "INSERT INTO TBL_Registro_Foto_Back (ID_Registro,RutaFoto,Fecha_Sincronizacion_Android,ID_General,urlFoto,flag_prioridad) " +
                    "SELECT " + values;
           $cordovaSQLite.execute(db, query).then(function(res){            
            q.resolve(res);
           },function(err){
            q.reject(err);
           })
           return q.promise;
        }                
      Result.saveTbl_Registros = function(values){                    
          var q = $q.defer();
          
          Result.getTbl_RegistrosByIdSum(values.ID_Suministro).then(function(res){            
              if (res.length > 0) {
                // ACTUALIZAMOS
                var registroFinal;                
                if (values.Registro_Confirmar_Lectura.length == 0 || values.Registro_Confirmar_Lectura == "") {
                  registroFinal = values.Registro_Lectura;
                }else{
                  registroFinal = values.Registro_Confirmar_Lectura
                }                            
                var params = [registroFinal,registroFinal,values.Registro_Observacion,values.Registro_dns,values.Registro_Ubicacion,values.Registro_Medidor,values.ID_Suministro];
                
                var query = "UPDATE TBL_Registros SET Registro_Lectura = ?, Registro_Confirmar_Lectura = ?, Registro_Observacion = ?, Registro_dns = ?, Registro_Ubicacion = ?, Registro_Medidor = ? WHERE ID_Suministro = ?"
                $cordovaSQLite.execute(db, query,params).then(function(res){            
                  
                  q.resolve(res);                  
                },function(err){                    
                  q.reject(err);
                })
              }else{
               
                var params = convertObjectA(values);
                var query = "INSERT INTO TBL_Registros VALUES(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query,params).then(function(res){            
                  q.resolve(res);
                  
                },function(err){                    
                  q.reject(err);
                })
              }
          })
          return q.promise;
      }
      Result.saveTbl_Registros_back = function(values){  
             
          var q = $q.defer();             
          Result.getTbl_RegistrosByIdSumBak(values.ID_Suministro).then(function(res){            
              if (res.length > 0) {
                // ACTUALIZAMOS                                
                var registroFinal;                
                if (values.Registro_Confirmar_Lectura.length == 0 || values.Registro_Confirmar_Lectura == "") {
                  registroFinal = values.Registro_Lectura;
                }else{
                  registroFinal = values.Registro_Confirmar_Lectura
                }                             
                var params = [registroFinal,registroFinal,values.Registro_Observacion,values.Registro_dns,values.Registro_Ubicacion,values.Registro_Medidor,values.ID_Suministro];
                
                var query = "UPDATE TBL_Registros_back SET Registro_Lectura = ?, Registro_Confirmar_Lectura = ?, Registro_Observacion = ?, Registro_dns = ?, Registro_Ubicacion = ?, Registro_Medidor = ? WHERE ID_Suministro = ?"
                $cordovaSQLite.execute(db, query,params).then(function(res){            
                
                  q.resolve(res);                  
                },function(err){   
                console.log(err);                 
                  q.reject(err);
                })
              }else{
                var params = convertObjectA(values);
                var query = "INSERT INTO TBL_Registros_back VALUES(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query,params).then(function(res){            
                  q.resolve(res);
                  
                },function(err){                    
                  q.reject(err);
                })
              }
          })
          return q.promise;
      }            

      Result.listSector = function(){
          var jsonResult = [];          
          var query = "SELECT Suministro_sector FROM tbl_suministro group by Suministro_Sector" ;
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;      
      }

      Result.getUltimoRegistro = function(idOperario){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registros order by id  desc LIMIT 1 " 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            console.log(error);
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_Registros = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registros" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_Registros_back = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registros_back" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
    function sumarDias(fecha, dias){
      fecha.setDate(fecha.getDate() + dias);
      var dd = fecha.getDate();
      var mm = fecha.getMonth()+1;
      var yyyy = fecha.getFullYear();
      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 
      var hoy = yyyy+''+mm+''+dd;           
      return hoy;
    }      
    Result.deleteRegistrosBackByDate = function(){
            var q = $q.defer();
            var d = new Date();
            var dateFilter = sumarDias(d, -7);
            console.log(dateFilter);
            var query = "DELETE FROM TBL_Registros_back " + 
            "Where replace(substr(Registro_Fecha_SQLITE,0,11),'-','') <= '" + dateFilter + "'" ;            
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise; 
  } 

    Result.deleteSuministroBackByDate = function(){
            var q = $q.defer();
            var d = new Date();
            var dateFilter = sumarDias(d, -3);
            console.log(dateFilter);
            var query = "DELETE FROM tbl_suministro_back " + 
            "Where replace(substr(fecha_movil,0,11),'-','') <= '" + dateFilter + "'" ;            
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise; 
  }        
      Result.getTbl_Registros_lote = function(id){
          var jsonResult = [];      
          var params = [id];
          var query = "SELECT * FROM TBL_Registros WHERE id > ? LIMIT 50" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_Registros_Total = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registros" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){             
            q.resolve(result.rows.length)
          }, function(error){            
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_Suministros_Back = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM tbl_suministro_back" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){             
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){            
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_Registros_Total_Back = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registros_back" 
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){             
            q.resolve(result.rows.length)
          }, function(error){            
            q.reject(error)
          })
          return q.promise;
      }      
      Result.deleteTbl_Registros = function(values){
          var q = $q.defer();   
          var query = "DELETE FROM TBL_Registros";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
        }
      Result.deleteTbl_SuministrosByEstado= function(values){
          var q = $q.defer();   
          var query = "DELETE FROM tbl_suministro WHERE estado = 'B'";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
        }        
      Result.getTbl_Registros_Fotos = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registro_Foto"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_Registros_Fotos_back = function(){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Registro_Foto_Back"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.deleteTbl_Registros_Fotos = function(values){
          var q = $q.defer();   
          var query = "DELETE FROM TBL_Registro_Foto";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
        }
        Result.deleteTbl_Registros_FotosByName = function(RutaFoto){
          var q = $q.defer();
          var params = [RutaFoto];          
          var query = "DELETE FROM TBL_Registro_Foto WHERE RutaFoto = ?";
          
             $cordovaSQLite.execute(db, query,params).then(function(res){             
              q.resolve(res);
             },function(err){             
              q.reject(err);
             })    
           return q.promise;
        }

      Result.getValuesSavetbl_Suministros = function(data){
        
        var q = $q.defer();
        var values ="";
        var i = 0;
        var x = 0;
        var masivo = false;        
        console.log('alva',data);
        if (data.length > 400 ) { masivo = true};        
        Result.deleteTbl_Suministros().then(function(resDelete){          
          angular.forEach(data,function(item,index){            
            i++;
            x++;   
            values += "'" + item.ID_Suministro + "','" + item.Suministro_Numero + "','" + item.Suministro_Medidor 
                   + "','" + item.Suministro_Cliente + "','" + item.direccion + "','" + item.Suministro_dns + "','" + item.Suministro_LecturaMinima 
                   + "','" + item.Suministro_LecturaMaxima + "','" + item.ConsumoPromedio + "','" + item.LecturaAnterior 
                   + "','" + item.id_Operario + "','" + item.SuministroOrden + "','" + item.r1_lectura + "','" + item.s1_lectura + "','" + item.Estado  
                   + "','" + item.Suministro_Latitud + "','" + item.Suministro_Longitud + "','" + item.Suministro_CantidadDigitos + "','" + item.Suministro_TipoProceso 
                   + "','" + item.flagSelfie  + "','" + item.aledano_1  + "','" + item.aledano_2 + "','" + item.cliente_vip +  "','" + item.Suministro_Sector +  "','" + item.PorceCalculo +  "','" + item.Inicial +  "','" + item.suministro_Consumo1 +  "' UNION ALL SELECT ";
            if (masivo == true){
                if ( i >= 450 ) {
                  values = values.substring(0,values.length-17);
                  Result.saveTbl_Suministros(values);
                  values = "";
                  i = 0;
                  if (x == data.length) {                    
                    q.resolve({ status : 'success' , cantidad: data.length });
                  }
                }else{
                    if (x == data.length) {
                      values = values.substring(0,values.length-17);
                      Result.saveTbl_Suministros(values);
                      values = "";                      
                      q.resolve({ status : 'success' , cantidad: data.length });
                    };
                };
            };          
          });
          if (masivo == false) {
            values = values.substring(0,values.length-17);        
            Result.saveTbl_Suministros(values).then(function(){
              q.resolve({ status : 'success' , cantidad: data.length });
            },function(err){
              q.reject(err);
            });
          }          
        })
        return q.promise;
      }
      Result.getValuesSavetbl_Suministros_Relectura = function(idOperario,data){        
        var q = $q.defer();
        var values ="";
          angular.forEach(data,function(item,index){
            var idSuministro = item.ID_Suministro;            
            Result.validaIfExistSumRelect(idOperario,idSuministro).then(function(res){ 
            console.log(res);                                         
              if(res.length == 0){
                values = "";
                values += "'" + item.ID_Suministro + "','" + item.Suministro_Numero + "','" + item.Suministro_Medidor 
                   + "','" + item.Suministro_Cliente + "','" + item.direccion + "','" + item.Suministro_dns + "','" + item.Suministro_LecturaMinima 
                   + "','" + item.Suministro_LecturaMaxima + "','" + item.ConsumoPromedio + "','" + item.LecturaAnterior 
                   + "','" + item.id_Operario + "','" + item.SuministroOrden + "','" + item.r1_lectura + "','" + item.s1_lectura + "','" + 'A'  
                   + "','" + item.Suministro_Latitud + "','" + item.Suministro_Longitud + "','" + item.Suministro_CantidadDigitos + "','" + '4' 
                   + "','" + item.flagSelfie  + "','" + item.aledano_1  + "','" + item.aledano_2 + "','" + item.cliente_vip +  "','" + item.Suministro_Sector +  "','" + item.PorceCalculo +  "','" + item.Inicial +  "' UNION ALL SELECT ";
                values = values.substring(0,values.length-17);                
                Result.saveTbl_Suministros(values).then(function(){
                  q.resolve({ status : 'success' , cantidad: data.length });
                },function(err){
                  q.reject(err);
                });
              }
            })          
          });        
        
        return q.promise;
      }

      Result.getValuesSavetbl_Suministros_Foto = function(data){
        
        var q = $q.defer();
        var values ="";
        var i = 0;
        var x = 0;
        var masivo = false;        
        if (data.length > 400 ) { masivo = true};        
        Result.deleteTbl_Suministros_Foto().then(function(resDelete){          
          angular.forEach(data,function(item,index){            
            i++;
            x++;   
            
            values += "'" + item.ID_Suministro + "','" + item.Suministro_Numero + "','" + item.Suministro_Medidor 
                   + "','" + item.Suministro_Cliente + "','" + item.direccion + "','" + item.Suministro_dns + "','" + item.Suministro_LecturaMinima 
                   + "','" + item.Suministro_LecturaMaxima + "','" + item.ConsumoPromedio + "','" + item.LecturaAnterior 
                   + "','" + item.id_Operario + "','" + item.SuministroOrden + "','" + item.r1_lectura + "','" + item.s1_lectura + "','" + 'A'  
                   + "','" + item.Suministro_Latitud + "','" + item.Suministro_Longitud + "','" + item.Suministro_CantidadDigitos 
                   + "','" + item.Suministro_TipoProceso + "','" + item.flagSelfie + "','" + item.ID_General + "','" + item.aledano_1 + "','" + item.aledano_2 + "','" + item.Estado + "' UNION ALL SELECT ";
            if (masivo == true){
                if ( i >= 450 ) {
                  values = values.substring(0,values.length-17);
                  Result.saveTbl_Suministros_Foto(values);
                  values = "";
                  i = 0;
                  if (x == data.length) {                    
                    q.resolve({ status : 'success' , cantidad: data.length });
                  }
                }else{
                    if (x == data.length) {
                      values = values.substring(0,values.length-17);
                      Result.saveTbl_Suministros_Foto(values);
                      values = "";                      
                      q.resolve({ status : 'success' , cantidad: data.length });
                    };
                };
            };          
          });
          if (masivo == false) {
            values = values.substring(0,values.length-17);        
            Result.saveTbl_Suministros_Foto(values).then(function(){
              q.resolve({ status : 'success' , cantidad: data.length });
            },function(err){
              q.reject(err);
            });
          }          
        })
        return q.promise;
      }

    Result.validaIfExistSum = function(idOperario,id_suministro){
      var jsonResult = [];          
      var params = [idOperario,id_suministro];          
      var query = "SELECT * FROM tbl_suministro_foto WHERE id_Operario = ? AND ID_Suministro = ?"
      var q = $q.defer();
      $cordovaSQLite.execute(db,query,params).then(function(result){
        for (var i = 0; i < result.rows.length; i++) {       
          jsonResult.push(result.rows.item(i))
        }
        q.resolve(jsonResult)
      }, function(error){
        q.reject(error)
      })
      return q.promise;
    }

    Result.validaIfExistSumRelect = function(idOperario,id_suministro){
      var jsonResult = [];          
      var params = [idOperario,id_suministro];          
      var query = "SELECT * FROM tbl_suministro WHERE id_Operario = ? AND ID_Suministro = ? AND Suministro_TipoProceso = 4"
      var q = $q.defer();
      $cordovaSQLite.execute(db,query,params).then(function(result){
        for (var i = 0; i < result.rows.length; i++) {       
          jsonResult.push(result.rows.item(i))
        }
        q.resolve(jsonResult)
      }, function(error){
        q.reject(error)
      })
      return q.promise;
    }    
    
      Result.getValuesSavetbl_Suministros_Foto_Interno = function(idOperario,data){        
        var q = $q.defer();
        var values ="";
          angular.forEach(data,function(item,index){
            var idSuministro = item.ID_Suministro;            
            Result.validaIfExistSum(idOperario,idSuministro).then(function(res){                                          
              if(res.length == 0){
                values = "";
                
                values += "'" + item.ID_Suministro + "','" + item.Suministro_Numero + "','" + item.Suministro_Medidor 
                       + "','" + item.Suministro_Cliente + "','" + item.direccion + "','" + item.Suministro_dns + "','" + item.Suministro_LecturaMinima 
                       + "','" + item.Suministro_LecturaMaxima + "','" + item.ConsumoPromedio + "','" + item.LecturaAnterior 
                       + "','" + item.id_Operario + "','" + item.SuministroOrden + "','" + item.r1_lectura + "','" + item.s1_lectura + "','" + 'A'  
                       + "','" + item.Suministro_Latitud + "','" + item.Suministro_Longitud + "','" + item.Suministro_CantidadDigitos 
                       + "','" + item.Suministro_TipoProceso + "','" + item.flagSelfie + "','" + item.ID_General + "','" + item.aledano_1 + "','" + item.aledano_2 + "','" + item.Estado + "' UNION ALL SELECT ";
                       
                values = values.substring(0,values.length-17);                
                Result.saveTbl_Suministros_Foto(values).then(function(){
                  q.resolve({ status : 'success' , cantidad: data.length });
                },function(err){
                  q.reject(err);
                });
              }
            })          
          });        
        
        return q.promise;
      }
      Result.saveTbl_Suministros = function(values){
        
          var q = $q.defer();   
          var query = "INSERT INTO tbl_suministro (ID_Suministro,Suministro_Numero,Suministro_Medidor,Suministro_Cliente,Suministro_Direccion,Suministro_dns,Suministro_LecturaMinima,"
                      + "Suministro_LecturaMaxima,ConsumoPromedio,LecturaAnterior,id_Operario,SuministroOrden,r1_lectura,s1_lectura,estado,Suministro_Latitud,Suministro_Longitud,Suministro_CantidadDigitos,Suministro_TipoProceso,flagSelfie,aledano_1,aledano_2,cliente_vip,Suministro_Sector,PorceCalculo,Inicial,ConsumoAnterior) " + "SELECT " + values;                 
             $cordovaSQLite.execute(db, query).then(function(res){
              q.resolve(res);
              
             },function(err){
              console.log(err)
              q.reject(err);
             })    
           return q.promise;
      }

      Result.saveTbl_Suministros_Foto = function(values){
        
          var q = $q.defer();   
          var query = "INSERT INTO tbl_suministro_foto (ID_Suministro,Suministro_Numero,Suministro_Medidor,Suministro_Cliente,Suministro_Direccion,Suministro_dns,Suministro_LecturaMinima,"
                      + "Suministro_LecturaMaxima,ConsumoPromedio,LecturaAnterior,id_Operario,SuministroOrden,r1_lectura,s1_lectura,estado,Suministro_Latitud,Suministro_Longitud,Suministro_CantidadDigitos,Suministro_TipoProceso,flagSelfie,ID_General,aledano_1,aledano_2,estado_general) " + "SELECT " + values;                 
             $cordovaSQLite.execute(db, query).then(function(res){
              q.resolve(res);
              
             },function(err){
              console.log(err)
              q.reject(err);
             })    
           return q.promise;
      }      

      Result.updateEstatusTbl_Suministros = function(params){
          var q = $q.defer();   
          var query = "UPDATE tbl_suministro SET estado = ? WHERE id = ?";
             $cordovaSQLite.execute(db, query,params).then(function(res){               
              q.resolve(res);
             },function(err){              
              
              q.reject(err);
             })    
           return q.promise;
        } 


      Result.updateEstatusTbl_Suministros_Foto = function(params){
          var q = $q.defer();   
          var query = "UPDATE tbl_suministro_foto SET estado = ? WHERE id = ?";
             $cordovaSQLite.execute(db, query,params).then(function(res){               
              q.resolve(res);
             },function(err){              
              
              q.reject(err);
             })    
           return q.promise;
        }         

      Result.deleteTbl_Suministros = function(values){
        
          var q = $q.defer();   
          var query = "DELETE FROM tbl_suministro";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
        }

      Result.deleteTbl_Suministros_Foto = function(values){
        
          var q = $q.defer();   
          var query = "DELETE FROM tbl_suministro_foto";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
        }

      Result.getTbl_Suministros_Cant = function(idOperario,tipoProceso){
          var jsonResult = [];
          var params = [idOperario];          
          var query = "select count(id_suministro)cantidad,estado from tbl_suministro WHERE id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ") group by estado"
          
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }

      Result.getTbl_Suministros_CantTotal = function(idOperario,tipoProceso){
        var jsonResult = [];
        var params = [idOperario];          
        var query = "select count(id_suministro)cantidad from tbl_suministro WHERE id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ") AND estado = 'A'";
        var q = $q.defer();
        $cordovaSQLite.execute(db,query,params).then(function(result){
          for (var i = 0; i < result.rows.length; i++) {       
            jsonResult.push(result.rows.item(i))
          }
          q.resolve(jsonResult)
        }, function(error){
          q.reject(error)
        })
        return q.promise;
    }
      Result.getTbl_Suministros_Cant_Foto = function(idOperario,estado_general){
          var jsonResult = [];
          var params = [idOperario,estado_general];
          var query = "select count(id_suministro)cantidad,estado from tbl_suministro_foto WHERE id_Operario = ? AND estado_general = ? group by estado"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }                       
      Result.getTbl_Suministros = function(cant,filter,idOperario,tipoProceso){
          var jsonResult = [];          
          var params = [cant,idOperario];          
          var query = "SELECT * FROM tbl_suministro  WHERE SuministroOrden > ? AND estado = 'A' AND id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ") AND (Suministro_Numero like '%" + filter + "%' " +
                      "OR Suministro_Cliente like '%" + filter + "%' OR Suministro_Direccion like '%" + filter + "%' "+
                      "OR Suministro_Medidor like '%" + filter + "%') order by SuministroOrden limit 6"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_Suministros_All = function(idOperario){
          var jsonResult = [];          
          var params = [idOperario];          
          var query = "SELECT * FROM tbl_suministro  WHERE estado = 'A' AND id_Operario = ? order by SuministroOrden"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_SuministrosValidar = function(idOperario,tipoProceso){
          var jsonResult = [];          
          var params = [idOperario];          
          var query = "SELECT * FROM tbl_suministro  WHERE estado = 'A' AND id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ")";
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_Suministros_Foto = function(cant,filter,idOperario,estado_general){
          var jsonResult = [];          
          var params = [cant,idOperario,estado_general];          
          var query = "SELECT * FROM tbl_suministro_foto  WHERE SuministroOrden > ? AND estado = 'A' AND id_Operario = ? AND estado_general = ? AND (Suministro_Numero like '%" + filter + "%' " +
                      "OR Suministro_Cliente like '%" + filter + "%' OR Suministro_Direccion like '%" + filter + "%' "+
                      "OR Suministro_Medidor like '%" + filter + "%') order by SuministroOrden limit 6"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_SuministrosAux = function(cant,filter,idOperario,tipoProceso){
          var jsonResult = [];          
          var params = [idOperario,filter,filter];
          var query = "SELECT * FROM tbl_suministro  WHERE id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ") AND (Suministro_Numero = ? OR Suministro_Medidor = ?)"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_SuministrosAux_Foto = function(cant,filter,idOperario,estado_general){
          var jsonResult = [];          
          var params = [idOperario,estado_general,filter,filter];
          var query = "SELECT * FROM tbl_suministro_foto  WHERE id_Operario = ? AND estado_general = ? AND (Suministro_Numero = ? OR Suministro_Medidor = ?)"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            console.log(error);
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_SuministrosMore = function(cant,filter,idOperario,tipoProceso){
        
          var jsonResult = [];          
          var params = [cant,idOperario];
          var query = "SELECT * FROM tbl_suministro  WHERE SuministroOrden > ? AND estado = 'A' AND id_Operario = ? AND Suministro_TipoProceso in (" + tipoProceso + ") order by SuministroOrden limit 6"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_RegistrosByIdSum = function(id_suministro){
        
          var jsonResult = [];          
          var params = [id_suministro];
          var query = "SELECT * FROM TBL_Registros  WHERE id_suministro = ?"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_RegistrosByIdSumBak = function(id_suministro){
        
          var jsonResult = [];          
          var params = [id_suministro];
          var query = "SELECT * FROM TBL_Registros_back  WHERE id_suministro = ?"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      

      Result.getTbl_SuministrosById = function(id,value,orden,tipoProceso){
          var jsonResult = [];
          var params = [id];
          var query = "SELECT * FROM tbl_suministro  WHERE SuministroOrden " + value +"= ? AND estado = 'A' AND Suministro_TipoProceso in (" + tipoProceso + ") order by SuministroOrden "+ orden + " limit 1"                    
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_SuministrosByIdAux = function(id,value,orden,tipoProceso){
          var jsonResult = [];
          var params = [id];
          var query = "SELECT * FROM tbl_suministro  WHERE SuministroOrden " + value +" ? AND estado = 'A'  AND Suministro_TipoProceso in (" + tipoProceso + ") order by SuministroOrden "+ orden + " limit 1"                    
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_SuministrosByIdChange = function(idOperario,orden,tipoProceso){
          var jsonResult = [];          
          var params = [idOperario];
          var query = "SELECT * FROM tbl_suministro  WHERE  id_Operario = ? AND estado = 'A' AND Suministro_TipoProceso in (" + tipoProceso + ")  order by SuministroOrden " + orden + " limit 1"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }


      Result.getTbl_SuministrosById_Foto = function(id,value,orden,estado_general){
          var jsonResult = [];
          var params = [id,estado_general];
          var query = "SELECT * FROM tbl_suministro_foto  WHERE SuministroOrden " + value +"= ? AND estado_general = ? AND estado = 'A'  order by SuministroOrden "+ orden + " limit 1"                    
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }
      Result.getTbl_SuministrosByIdAux_Foto = function(id,value,orden,estado_general){
          var jsonResult = [];
          var params = [id,estado_general];
          var query = "SELECT * FROM tbl_suministro_foto  WHERE SuministroOrden " + value +" ? AND estado_general = ? AND estado = 'A'  order by SuministroOrden "+ orden + " limit 1"                    
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }      
      Result.getTbl_SuministrosByIdChange_Foto = function(idOperario,orden,estado_general){
          var jsonResult = [];          
          var params = [idOperario,estado_general];
          var query = "SELECT * FROM tbl_suministro_foto  WHERE  id_Operario = ? AND estado_general = ? AND estado = 'A' order by SuministroOrden " + orden + " limit 1"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }


      Result.getTbl_SuministrosAll = function(){
          var jsonResult = [];          
          var query = "select * from tbl_suministro where not suministro_latitud = '' order by Suministro_Longitud"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      } 

      Result.getTbl_SuministrosAll_ByProceso = function(tipoProceso){
          var jsonResult = [];          
          var query = "select * from tbl_suministro where not suministro_latitud = '' AND estado = 'A' AND Suministro_TipoProceso = " + tipoProceso + " order by Suministro_Longitud"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }                  
      // TABLA GRUPO DETALLE

      Result.getValuesSaveTbl_Detalle_Grupo = function(data){
        console.log(data);
        var values = "";
          angular.forEach(data,function(item,index){          
            values += "'" + item.ID_DetalleGrupo + "','" + item.Grupo + "','" + item.Codigo + "','"
                    + item.Descripcion + "','" + item.Abreviatura + "','" + item.PideFoto + "','" + item.NoPideFoto +  "' UNION ALL SELECT "    
          });
          values = values.substring(0,values.length-17);      
          var q = $q.defer();
          Result.deleteTbl_Detalle_grupo().then(function(){
        var query = "INSERT INTO TBL_Detalle_Grupo (ID_DetalleGrupo,Grupo,Codigo,Descripcion,Abreviatura,PideFoto,PideLectura) SELECT " + values;
            $cordovaSQLite.execute(db, query).then(function(res){
             q.resolve(res);
            },function(err){
              q.reject(err);
            })          
          })
           return q.promise;
        }
      Result.deleteTbl_Detalle_grupo = function(values){
        
          var q = $q.defer();   
          var query = "DELETE FROM TBL_Detalle_Grupo";
             $cordovaSQLite.execute(db, query).then(function(res){            
              q.resolve(res);
             },function(err){
              
              q.reject(err);
             })    
           return q.promise;
      }
      Result.getTbl_Detalle_grupoByGrupos = function(grupos){
          var jsonResult = [];          
          var query = "SELECT * FROM TBL_Detalle_Grupo  WHERE Grupo in(" + grupos + ")"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }

      Result.getTbl_Detalle_grupoByGrupo_Codigo = function(params){
          var jsonResult = [];
          var query = "SELECT * FROM TBL_Detalle_Grupo WHERE Grupo = ? AND Codigo = ?"
          var q = $q.defer();
          $cordovaSQLite.execute(db,query,params).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {       
              jsonResult.push(result.rows.item(i))
            }
            q.resolve(jsonResult)
          }, function(error){
            q.reject(error)
          })
          return q.promise;
      }            
      //
    var convertObjectA = function(object){
      var array = $.map(object, function(value, index) {          
          return value;
      });
      return array;
    }
    return Result;
})