angular.module('app.ServicesPhoto', [])

.factory('ServicesPhoto', function ($http,$q,sqliteServices,$cordovaFileOpener2,UrlApi,$cordovaCamera,$cordovaFileTransfer,$cordovaFile) {

	var Result = {}

		Result.callCamera = function(tipo){			
			var options= {
		        quality: 100,
		        destinationType: Camera.DestinationType.DATA_URL,
		        sourceType: Camera.PictureSourceType.CAMERA,
		        allowEdit: false,
		        encodingType: Camera.EncodingType.JPEG,
		        targetWidth: 600,
		        targetHeight: 450,
		        popoverOptions: CameraPopoverOptions,
		        saveToPhotoAlbum: false
		    }
			 var q = $q.defer();
			 if (tipo == 1) {
			 	options.sourceType = Camera.PictureSourceType.CAMERA;
			 }else{
			 	options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
			 }			 
		    $cordovaCamera.getPicture(options).then(function(result){			
				q.resolve(result)
			},function(err){
				q.reject(err)
			})
			return q.promise;

		}

		Result.savePhotoFolder = function(file,name){
			var uri = file;
	        var namephoto= name ;
	        var targetPath = cordova.file.externalRootDirectory + 'LECTURASLDS/' + namephoto;
	        var trustHosts = true
	        var options = {};
	        var q= $q.defer();
	        $cordovaFileTransfer.download(uri, targetPath, options, trustHosts)
	            .then(function(result) {	  
	            	q.resolve(result)
	            }, function(error) {
	              	q.reject(error)
	            }, function (progress) {
	               // $timeout(function () {
	               //    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
	               // })
            })
	            return q.promise;
		}

		Result.openFileApk = function(file){
			var q= $q.defer();
			  $cordovaFileOpener2.open(
			    file,
			    'application/vnd.android.package-archive'
			  ).then(function(res) {
			      q.resolve(res);
			  }, function(err) {
			      q.reject(err);
			  });
			return q.promise;
		}


		Result.saveVersion = function(nameVersion){
			var url = "http://www.dsige.com/descargas/luzdelsur/apk/appLecturasLDS.apk";	        
	        var targetPath = cordova.file.externalRootDirectory + 'LECTURASLDS_VERSION/' + nameVersion;
	        var trustHosts = true
	        var options = {};
	        var q= $q.defer();	        
	        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
	            .then(function(result) {	  
	            	q.resolve(result)
	            }, function(error) {
	              	q.reject(error)
	            }, function (progress) {
	            	var progressok = (progress.loaded / progress.total) * 100;
	            	q.notify(progressok);
	               // $timeout(function () {
	               //    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
	               // })
            })
	            return q.promise;
		}		


		

		Result.deletePhotoFolder = function(name){
			
			var q = $q.defer();			
			 $cordovaFile.removeFile(cordova.file.externalRootDirectory + 'LECTURASLDS/', name)
			 .then(function (success) {
		        q.resolve(success)
		     }, function (error) {
		        q.reject(error)		        
		     });
		     return q.promise;
		}
		Result.deletePhotoFolder_back = function(name){
			
			var q = $q.defer();			
			 $cordovaFile.removeFile(cordova.file.externalRootDirectory + 'LECTURASLDS/', name)
			 .then(function (success) {
		        q.resolve(success)
		     }, function (error) {
		        q.resolve(error)		        
		     });
		     return q.promise;
		}		

		Result.transferPhoto = function(namePhoto,filePath,idGeneral,flag_prioridad){
			var q = $q.defer();
			var server = UrlApi + '/UploadPhoto?nameFile=' + namePhoto+'&idGeneral=' + idGeneral+'&flagPrioridad=' + flag_prioridad;			
			var options = {
				fileKey: "file",
	            fileName: namePhoto,
	            chunkedMode: false,
	            mimeType: "image/jpg",
	            timeout : 20000,
	        };	        
	        $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {	        	
	        	q.resolve(result);
	        	sqliteServices.deleteTbl_Registros_FotosByName(namePhoto);	        	
	        },function(err){
	        	console.log('err')
	        	//alert('Error tranferir foto')
	        	//alert(JSON.stringify(err));
	        	q.reject(err)
	        })
	        return q.promise;
		}
		Result.transferPhoto_Back = function(namePhoto,filePath,idGeneral,flag_prioridad){
			var q = $q.defer();
			var server = UrlApi + '/UploadPhoto?nameFile=' + namePhoto+'&idGeneral=' + idGeneral+'&flagPrioridad=' + flag_prioridad;
			var options = {
				fileKey: "file",
	            fileName: namePhoto,
	            chunkedMode: false,
	            mimeType: "image/jpg",
	            timeout : 20000,
	        };	        
	        $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {	        	
	        	q.resolve(result);
	        	//sqliteServices.deleteTbl_Registros_FotosByName(namePhoto);	        	
	        },function(err){
	        	console.log('err')
	        	//alert('Error tranferir foto')
	        	//alert(JSON.stringify(err));
	        	q.reject(err)
	        })
	        return q.promise;
		}
	return Result;

})