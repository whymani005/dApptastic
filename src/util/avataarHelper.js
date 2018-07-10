
//const names = ['Mike', 'Harvey', 'Rachel', 'Jessica', 'Donna', 'Loius', 'Rachel'];

const topType = ['Eyepatch', 'Hat', 'Hijab', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly',
'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairMiaWallace',
'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
'NoHair', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 
'ShortHairShortCurly','ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides',
'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4'];

const accessoriesType = ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'];

const hairColor = ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 
'PastelPink', 'Platinum', 'Red', 'SilverGray'];

const facialHairType = ['BeardLight', 'BeardMagestic', 'BeardMedium', 'Blank', 'MoustacheFancy', 
'MoustacheMagnum'];

const facialHairColor = ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red'];

const clotheType = ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall',
'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'];

const clotheColor = ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue',
'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'];

const eyeType = ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint',
'Surprised', 'Wink', 'WinkWacky'];

const eyebrowType = ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited',
'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural','UnibrowNatural','UpDown','UpDownNatural'];

const mouthType = ['Concerned','Default','Disbelief','Eating','Grimace','Sad','ScreamOpen',
'Serious','Smile','Tongue','Twinkle','Vomit'];

const skinColor = ['Tanned','Yellow','Pale','Light','Brown','DarkBrown','Black'];


function getRandomArrValue(arr) {
  var retVal = arr[Math.floor(Math.random() * arr.length)];
  return retVal;
}


const getRandomAttrVal = (attrType) => {
  if(attrType === 'topType') {
    return getRandomArrValue(topType);
  } else if(attrType === 'accessoriesType') {
    return getRandomArrValue(accessoriesType);
  } else if(attrType === 'hairColor') {
    return getRandomArrValue(hairColor);
  } else if(attrType === 'facialHairType') {
    return getRandomArrValue(facialHairType);
  } else if(attrType === 'facialHairColor') {
    return getRandomArrValue(facialHairColor);
  } else if(attrType === 'clotheType') {
    return getRandomArrValue(clotheType);
  } else if(attrType === 'clotheColor') {
    return getRandomArrValue(clotheColor);
  } else if(attrType === 'eyeType') {
    return getRandomArrValue(eyeType);
  } else if(attrType === 'eyebrowType') {
    return getRandomArrValue(eyebrowType);
  } else if(attrType === 'mouthType') {
    return getRandomArrValue(mouthType);
  } else if(attrType === 'skinColor') {
    return getRandomArrValue(skinColor);
  }
  return 'Blank';
};

export default getRandomAttrVal;



