const generateTeamCode = () => {
    // Define the characters that can be used in the team code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6; // Length of the team code
    let teamCode = '';
  
    // Generate a random team code
    for (let i = 0; i < codeLength; i++) {
      teamCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return teamCode;
  };


  export default generateTeamCode;