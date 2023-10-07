const moment = require("moment-timezone");

exports.generateCurrentDate = () => {
  return moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
};
