export const getImageDimensions = (file)=>
 new Promise((resolve,reject)=>{
   const img = new Image();
   const url = URL.createObjectURL(file);

   img.onload = ()=> {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(url);
   };

   img.onerror = ()=> {
      reject();
      URL.revokeObjectURL(url);
   };

   img.src = url;
});