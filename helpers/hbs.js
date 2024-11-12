// google auth
const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (creationGoalUser, loggedUser, creationGoalId, floating = true) {  
    if (creationGoalUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {        
        return `<a href="/creationGoals/edit/${creationGoalId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/creationGoals/edit/${creationGoalId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
  getMonth: function (date) {
    const dateMonth= new Date(date).getMonth() + 1;
    return dateMonth;
  },
  getDay: function (date) {
    const dateDay= new Date(date).getDate();
    return dateDay;
  }, 
  getYear: function (date) {   
    // If no parapmeter detect by ensuring the date is a valid Date object
    const validDate = new Date(date);
    if (isNaN(validDate)) {
      // Return current year if the date is invalid
      return new Date().getFullYear();
    }
  
    // Otherwise, return the year from the valid date
    const dateYear = validDate.getFullYear();
    return dateYear;
  },
}