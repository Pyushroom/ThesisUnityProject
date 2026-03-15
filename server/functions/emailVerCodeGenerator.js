// randomStringGenerator.js
const generateRandomCode = () => {
    const length = 6;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters[Math.floor(Math.random() * charactersLength)];
    }
    return randomString;
  }
  
  export default generateRandomCode;
  