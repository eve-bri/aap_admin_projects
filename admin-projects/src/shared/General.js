import publicIP from 'react-native-public-ip';

export const getIpAddress = async () =>{
    var ipAdress = "";
    await publicIP()
              .then(ip => {
                ipAdress = ip;
              })
              .catch(error => {
                console.log(error);
              });
    return ipAdress;
}