var shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var listNames = shuffle([
    'Junko',
    'Christal',
    'Doug',
    'Ayanna',
    'Rodolfo',
    'Dwayne',
    'Rosaline',
    'Vella',
    'Moriah',
    'Lidia',
    'Kristina',
    'Irina',
    'Zane',
    'Ewa',
    'Jerlene',
    'Gidget',
    'Raul',
    'Cherie',
    'Jeraldine',
    'Karissa',
    'Gonzalo',
    'Aurelia',
    'Cathi',
    'Thi',
    'Juliana',
    'Francie',
    'Maren',
    'Eusebia',
    'Antony',
    'Renate',
    'Celia',
    'Sudie',
    'Dino',
    'Ta',
    'Tashina',
    'Dexter',
    'Delisa',
    'Terina',
    'Greg',
    'Danita',
    'Frederick',
    'Larissa',
    'Christel',
    'Anisa',
    'Yen',
    'Waneta',
    'Claudio',
    'Barton',
    'Glynda',
    'Beula'
]);
var studentNamePosition = -1;
var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

var getStudentName = function(){
    studentNamePosition++;
    return listNames[studentNamePosition];

};



module.exports = {
    newStudent(){
        return {
            uuid: guid(),
            name: getStudentName(),
            score: 0,
            progress: 0,
            start: Date.now()
        };
    }
};
