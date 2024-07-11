import publicIP from 'react-native-public-ip';

export const getIpAddress = async () =>{
  var ipAdress:string = "";
  await publicIP()
              .then(ip => {
                ipAdress = ip;
              })
              .catch(error => {
                console.log(error);
              });
  return ipAdress;
}

export const getExtensionFile = (file:string) => {
  var arrayName = file.split('.');
  return arrayName[arrayName.length -1]
}