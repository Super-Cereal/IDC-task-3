function getNoun(number:number, one:string, two:string, five:string) {
    // сколоняет слово one_two_five в зависимости от числа number
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  }
function checkIfPositionIsChanged(userVotes:number, userIndex:number, users: any) {
    while (userIndex - 1 >= 0){
        let votes = Number(users[userIndex - 1].valueText.split(" ")[0]);
        if (votes < userVotes) {
          let l = users[userIndex - 1];
          users[userIndex - 1] = users[userIndex];
          users[userIndex] = l;
          userIndex -= 1;
        } else break;
      }
      while (userIndex + 1 < users.length)
      {
        let votes = Number(users[userIndex + 1].valueText.split(" ")[0]);
        if (votes > userVotes) {
          let l = users[userIndex + 1];
          users[userIndex + 1] = users[userIndex];
          users[userIndex] = l;
          userIndex += 1;
        } else break;
      }
  }
export function countVotesForUser(userId:number, k:number, users: any) {
    if (userId) {
      let userIndex = users.findIndex((u:any) => (u.id === userId));
      let user = users[userIndex];
      let number = Number(user.valueText.split(" ")[0]) + k;
      user.valueText = `${number} ${getNoun(number, "голос", "голоса", "голосов")}`
      checkIfPositionIsChanged(number, userIndex, users)
    }
  }