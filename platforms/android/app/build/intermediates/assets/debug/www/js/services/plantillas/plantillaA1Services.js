angular.module('app.plantillaA1Services', [])

.factory('plantillaA1Services',function($http,$q,$cordovaSQLite){

	var Result = {};
	// FUNCIONES SQLITE

	Result.saveMovilOtCab = function(params){		
		// PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
		var objects = convertObject(params);
		
        var q = $q.defer();
        var query = "INSERT INTO tbl_Movil_OT_Cab (id_ordenTrabajo,fechaRegistro_OTC,direccion_OTC,suministro_OTC," + 
        			"nomreCliente_OTC,dniCliente_OTC,obs_OTC,id_ejecutado_OTC,id_motivo_OTC,hora_OTC,minuto_OTC,latitud_OTC,longitud_OTC,subEstacion_OTC,nro_Inspeccion_OTC,idGeneral)" + 
        			" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
         $cordovaSQLite.execute(db, query, objects).then(function(res){	
          Result.gettbl_Movil_OT_CabById(res.insertId).then(function(result){
              q.resolve({
                insertId : res.insertId,
                data : result
              });
          },function(err){
            q.reject(err);
          })          
         },function(err){
          q.reject(err);
         })
         return q.promise;
	}
	Result.updateMovilOtCab = function(params,idOrden){		
		// PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
		var objects = convertObject(params);
        var q = $q.defer();
        var query = "UPDATE tbl_Movil_OT_Cab SET id_ordenTrabajo = ?,fechaRegistro_OTC = ?,direccion_OTC = ?,suministro_OTC = ?," + 
        			"nomreCliente_OTC = ?,dniCliente_OTC = ?,obs_OTC = ?,id_ejecutado_OTC = ?,id_motivo_OTC = ?,hora_OTC = ?,minuto_OTC = ?,subEstacion_OTC = ?,nro_Inspeccion_OTC = ? " + 
        			"WHERE id_ordenTrabajo = " + idOrden;
         $cordovaSQLite.execute(db, query, objects).then(function(res){	
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;
	}
  Result.updateMovilOtCabBunker = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
        var params = values;
        var q = $q.defer();
        var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET suministro = ?, fechaInspeccion = ?, estado_bunker = ?, acta = ?, obsTrabajo = ?, sedpmi = ? WHERE id_ordenTrabajo = " + idOrden;
         $cordovaSQLite.execute(db, query, params).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;
  }
    Result.updateMovilOtCab5Pernos = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
        var params = values;
        var q = $q.defer();
        var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET suministro = ?, fechaInspeccion = ?, estado_bunker = ?, acta = ?, obsTrabajo = ?, fechaProgramacion = ? WHERE id_ordenTrabajo = " + idOrden;
         $cordovaSQLite.execute(db, query, params).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;
  }
  Result.updateMovilOtCabSIMS = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
        var params = values;
        var q = $q.defer();
        var query = "UPDATE tbl_movil_ot_cab_sims set sed_Sims = ?,fechaRecepcion_Sims = ?,estado_Sims = ?,acta_Sims = ?,obs_Sims = ?,fechaProgramacion_Sims = ?, idCategoria = ? WHERE id_ordenTrabajo = " + idOrden;
         $cordovaSQLite.execute(db, query, params).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;
  }  
  Result.updateMovilOtCabBunkerP2 = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var params = values;
      var q = $q.defer();
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET nro_MedidorRet = ? , marca_MedidorRet = ?, modelo_MedidorRet = ?, fase_MedidorRet = ?," +
                  "anio_MedidorRet = ?, tipoCaja_MedidorRet = ?, cobertura_MedidorRet = ?, valorDbm_MedidorRet = ?, intensidadSenial_MedidorRet = ?, serie_MedidorRet = ?, factor_MedidorRet = ?, idToroidal = ?" + 
                "WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, values).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }
  Result.updateMovilOtCab5Pernos2 = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var objects = convertObject(values);
      var q = $q.defer(); 
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET nro_MedidorRet = ?, marca_MedidorRet = ?, modelo_MedidorRet = ? ,fase_MedidorRet = ?, acometidaEstado = ?,ubicacionCaja = ?,resguardoPolicial = ?,espacioConfirmado = ? " +
                  "WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, objects).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }
  Result.updateMovilOtCab5Pernos3 = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var objects = convertObject(values);
      var q = $q.defer(); 
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET nro_MedidorRet = ?,marca_MedidorRet = ?, modelo_MedidorRet = ?,fase_MedidorRet = ?,selloCandado_MedidorRet = ?,capacidadITM_MedidorRet = ?,nro_MedidorIns = ?,marca_MedidorIns = ?,modelo_MedidorIns = ?, selloBornera_MedidorIns = ?" +
                  "WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, objects).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }  
  Result.updateMovilOtCabSIMSP2 = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var q = $q.defer();      
      var objects = convertObject(values);
      var query = "UPDATE tbl_movil_ot_cab_sims SET serie_TotalSP_Sims = ?,modelo_TotalSP_Sims = ?,lectura_TotalSP_Sims = ?,sed_TotalSP_Sims = ?," +
                  "estado_TotalSP_Sims = ?,ubicacion_TotalSP_Sims = ?,serie_MedidorAP_Sims = ?,modelo_MedidorAP_Sims = ?,lectura_MedidorAP_Sims = ?," +
                  "medicion_MedidorAP_Sims = ?,resolucion_MedidorAP_Sims = ?,ubiMedidor_MedidorAP_Sims = ?,ubiControl_MedidorAP_Sims = ?,ubiFoto_MedidorAP_Sims = ?," +
                  "poste_Accesi_Sims = ?,resguardo_Accesi_Sims = ?,acceso_Accesi_Sims = ?,alto_Accesi_Sims = ?,cobertura_Sims = ?,senial_Sims = ?" +
                  " WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, objects).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }
    Result.updateMovilOtCabSIMSP2_Ins = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var q = $q.defer();      
      var objects = convertObject(values);
      console.log(idOrden)
      var query = "UPDATE tbl_movil_ot_cab_sims SET suministro_TotalEcontrado_Sims = ?,  marca_TotalEcontrado_Sims = ?,  modelo_TotalEcontrado_Sims = ?, " +
                "serie_TotalEcontrado_Sims = ?,anio_TotalEcontrado_Sims = ?,factor_TotalEcontrado_Sims = ?,modelo_MedidorIns_Sims = ?,serie_MedidorIns_Sims = ?,marca_MedidorIns_Sims = ?," +
                "anio_MedidorIns_Sims = ?,precintoMedidor_MedidorIns_Sims = ?,precintoBornera_MedidorIns_Sims = ?,precintoReset_MedidorIns_Sims = ?,nroModen_MedidorIns_Sims = ?," +
                "ipFija_MedidorIns_Sims = ?, Operador_MedidorIns_Sims = ?,suministro_MedidorAPRet_Sims = ?,marca_MedidorAPRet_Sims = ?,modelo_MedidorAPRet_Sims = ?,serie_MedidorAPRet_Sims = ?," +
                "factor_MedidorAPRet_Sims = ?,anio_MedidorAPRet_Sims = ?,fase_MedidorAPRet_Sims = ?,lectura_MedidorAPRet_Sims = ?,cantDigitos_MedidorAPRet_Sims = ?,marca_MedidorAPIns_Sims = ?," +
                "modelo_MedidorAPIns_Sims = ?,serie_MedidorAPIns_Sims = ?,factor_MedidorAPIns_Sims = ?,sellomedidor_MedidorAPIns_Sims = ?,selloBornera_MedidorAPIns_Sims = ?, " +
                "anio_MedidorAPIns_Sims = ?,fase_MedidorAPIns_Sims = ?,lectura_MedidorAPIns_Sims = ?,constante_MedidorAPIns_Sims = ?,cantDigitos_MedidorAPIns_Sims = ?" +
                " WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, objects).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }
  Result.updateMovilOtCabBunkerP2_Ins = function(params,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var objects = convertObject(params);
      var q = $q.defer();
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET transf_corriente_marca_MedidorRet = ?, transf_corriente_serie_MedidorRet = ?,transf_corriente_factor_MedidorRet = ?, transf_tension_marca_MedidorRet = ?, transf_tension_serie_MedidorRet = ?,transf_tension_factor_MedidorRet = ?," +
                "nro_MedidorRet = ?, marca_MedidorRet = ?, modelo_MedidorRet = ?,serie_MedidorRet = ?, anio_MedidorRet = ?, lectura_MedidorRet = ?, display_MedidorRet = ?, factor_MedidorRet = ?," + 
                "nro_MedidorIns = ?, marca_MedidorIns = ?, modelo_MedidorIns = ?, anio_MedidorIns = ?, precintoEDN_MedidorIns = ?, precintoBornera_MedidorIns = ?," +
                "precintoCam_MedidorIns = ?, selloCandado1_MedidorIns = ?, selloCandado2_MedidorIns = ?, moden_MedidorIns = ?, chip_MedidorIns = ?, operario_MedidorIns = ?, tipoCaja_MedidorIns = ?," +
                "transf_corriente_marca_MedidorIns = ?, transf_corriente_serie_MedidorIns = ?, transf_corriente_factor_MedidorIns = ?, transf_tension_marca_MedidorIns = ?, transf_tension_serie_MedidorIns = ?,transf_tension_factor_MedidorIns = ?"
                " WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, objects).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }  
  Result.updateMovilOtCabBunkerP3 = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var params = values;
      var q = $q.defer();
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET sn_1 = ? , sn_2 = ?, sn_3 = ?, sn_4 = ?, sn_5 = ?,sn_6 = ?,sn_7 = ?,sn_8 = ?,sn_9 = ?," +
                  "sn_10 = ?, sn_11 = ? WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, values).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }
  Result.updateMovilOtCabBunkerP3BT = function(values,idOrden){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
      var params = values;
      var q = $q.defer();
      var query = "UPDATE tbl_Movil_OT_Cab_Bunker SET sn_1 = ? , sn_2 = ?, sn_3 = ?, sn_4 = ?, sn_5 = ?,sn_6 = ?,sn_7 = ?,sn_8 = ?,sn_9 = ?," +
                  "sn_10 = ?, sn_11 = ?, sn_12 = ? WHERE id_ordenTrabajo = " + idOrden;
       $cordovaSQLite.execute(db, query, values).then(function(res){ 
        q.resolve(res);
       },function(err){
        q.reject(err);
       })
      return q.promise;
  }      
  Result.gettbl_Movil_OT_CabById = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Cab WHERE id = " + id;
        var q = $q.defer()
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
  Result.gettbl_Movil_OT_Cab = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Cab WHERE id_ordenTrabajo = " + id;
        var q = $q.defer()
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
  Result.gettbl_Movil_OT_CabAll = function(id){    
        var jsonResult = [];        
        var query = "SELECT * FROM tbl_Movil_OT_Cab";
        var q = $q.defer()
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
    Result.gettbl_Movil_OT_CabAll_Bunker = function(){
        var jsonResult = [];        
        var query = "SELECT * FROM tbl_Movil_OT_Cab_Bunker";
        var q = $q.defer()
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
    Result.gettbl_Movil_OT_CabAll_Sims = function(){
        var jsonResult = [];        
        var query = "SELECT * FROM tbl_movil_ot_cab_sims";
        var q = $q.defer()
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
	Result.updateStatusOtCab = function(params){
		var objects = convertObject(params);
		
        var q = $q.defer();
        var query = "UPDATE tbl_movil_ot set Estado_OT = ? WHERE id_ordenTrabajo = ?";
         $cordovaSQLite.execute(db, query, objects).then(function(res){	
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;		
	}
  Result.updateMovilOtCabP2 = function(params){   
    // PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']
    var objects = convertObject(params);
        var q = $q.defer();
        var query = "UPDATE tbl_Movil_OT_Cab SET nro_MedidorRet_OTC = ?,marca_MedidorRet_OTC = ?,modelo_MedidorRet_OTC = ?, " + 
              "fase_MedidorRet_OTC = ?, estado_MedidorRet_OTC = ?,nro_MedidorIns_OTC = ?,marca_MedidorIns_OTC = ?,modelo_MedidorIns_OTC = ?, " + 
              "fase_MedidorIns_OTC = ?, estado_MedidorIns_OTC = ? where id_ordenTrabajo = ?";
         $cordovaSQLite.execute(db, query, objects).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;
  } 
	Result.updateMovilOtCabP3 = function(params){		
		// PARAMETROS VIENEN EN ESTE FORMATO : PARAMS = ['val1','val2','val3']    
	     	var objects = convertObject(params);
        var q = $q.defer();
        var query = "UPDATE tbl_Movil_OT_Cab SET selloBor1_OTC = ?,selloBor2_OTC = ?,aledanio1_OTC = ?, " + 
        			"aledanio2_OTC = ?, notificacion_OTC = ?,trabajo_solicitado = ?, trabajo_reportado = ?, ejecutivo = ?," +
              "chip = ?, variomod = ?,solicitante = ?,factor = ?, potencia = ?, anio = ? where id_ordenTrabajo = ?";              
         $cordovaSQLite.execute(db, query, objects).then(function(res){	
          q.resolve(res);
         },function(err){
          console.log(err)
          q.reject(err);
         })
         return q.promise;
	}
  Result.savetbl_Movil_OT_Det = function(params){
        var objects = convertObject(params);
        var q = $q.defer();
        
        var query = "INSERT INTO tbl_Movil_OT_Det (id_Registro,tipoRegistro,tipoMaterial,id_Codigo," + 
              "cantidad,fechaRegistroMovil,des_material,idGeneral,codigo) VALUES (?,?,?,?,?,?,?,?,?)";
         $cordovaSQLite.execute(db, query, objects).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;    
  }
  Result.updatetbl_Movil_OT_Det = function(params){
        var objects = convertObject(params);
        var q = $q.defer();
        
        var query = "UPDATE tbl_Movil_OT_Det SET cantidad = ? WHERE id = ?";
         $cordovaSQLite.execute(db, query, objects).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;    
  }  
  Result.gettbl_Movil_OT_Det = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Det WHERE id_Registro = " + id;
        var q = $q.defer()
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
  Result.gettbl_Movil_OT_DetAll = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Det";
        var q = $q.defer()
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

  Result.deleteTbl_Movil_Ot_DetById = function(id){        
        var q = $q.defer();        
        var query = "DELETE FROM tbl_Movil_OT_Det WHERE id = " + id;
         $cordovaSQLite.execute(db, query).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;      
  }
  Result.savetbl_Movil_OT_Foto = function(params){
        var objects = convertObjectA(params);
        var q = $q.defer();        
        var query = "INSERT INTO tbl_Movil_OT_Foto (id_Registro,nombre_FotoDet,obs_FotoDet,url_FotoDet," + 
              "fechaRegistroMovil_FotoDet,idGeneral) VALUES (?,?,?,?,?,?)";
         $cordovaSQLite.execute(db, query, objects).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;    
  }
  Result.gettbl_Movil_OT_Foto = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Foto WHERE id_Registro = " + id;
        var q = $q.defer()
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
  Result.gettbl_Movil_OT_FotoAll = function(id){    
        var jsonResult = [];
        var cant = cant;
        var query = "SELECT * FROM tbl_Movil_OT_Foto";
        var q = $q.defer()
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
  Result.deleteTbl_Movil_Ot_FotoByName = function(name){        
        var q = $q.defer();        
        var params = [name];
        var query = "DELETE FROM tbl_Movil_OT_Foto WHERE nombre_FotoDet = ?";
         $cordovaSQLite.execute(db, query,params).then(function(res){ 
          q.resolve(res);
         },function(err){
          q.reject(err);
         })
         return q.promise;      
  }
  var convertObject = function(object){
    var array = $.map(object, function(value, index) {
      if (value == null) {
        value = 0;
      };
      return value;
    });
    return array;
  }
  var convertObjectA = function(object){
    var array = $.map(object, function(value, index) {
        return value;

    });
    return array;
  }
  Result.getDateHoy = function(){
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    var hour = hoy.getHours();
    var minuts = hoy.getMinutes();
    var second = hoy.getSeconds();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
      hoy = yyyy+'-'+mm+'-'+dd + ' ' + hour + ':' + minuts + ':' + second;
      return hoy;  
  }
    Result.getDateHoyF = function(){
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    var hour = hoy.getHours();
    var minuts = hoy.getMinutes();
    var second = hoy.getSeconds();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
      hoy = yyyy+'-'+mm+'-'+dd;
      return hoy;  
  }
  Result.getDateHoyCod = function(){
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    var hour = hoy.getHours();
    var minuts = hoy.getMinutes();
    var second = hoy.getSeconds();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
      hoy = yyyy+''+mm+''+dd + '' + hour + '' + minuts + '' + second;
      return hoy;  
  }  

  Result.getCodUniq = function(){
    // CAPTURANDO FECHA ACTUAL
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    var hour = hoy.getHours();
    var minuts = hoy.getMinutes();
    var second = hoy.getSeconds();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    hoy = yyyy+''+mm+''+dd + '' + hour + '' + minuts + '' + second;
    // GENERANDO CODIGO ALEATORIO
    var codigoAle =  Math.floor(Math.random() * 1000000);
    // CODIGO DEL USUARIO LOGEADO
    var dataUser = JSON.parse(localStorage.getItem('dataUser')).ID_Operario;
    return dataUser + '_' + codigoAle + '_' + hoy;
  }


	// FUNCIONES HTTP
	return Result;
})