const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const User = require("../models/User");

router.post("/details", async (req, res) => {
  try {
    const competition = req.body.competition;
    const last = await Team.find({ competition }).sort({ token: -1 }).limit(1);
    const isIndividual = req.body.isIndividual === "individual" ? true : false;
    const participants = isIndividual
      ? [req.user.email]
      : [
          req.user.email,
          req.body.mate1,
          req.body.mate2,
          req.body.mate3,
          req.body.mate4,
        ];
    for (let email of participants) {
      if (!email) continue;
      let user = await User.findOne({ email });
      let teams = await Team.find({ participants: email, competition });
      if (teams)
        throw new Error(`${email} already registered in ${competition}`);
      if (!user) {
        throw new Error(`${mail} not registered`);
      }
    }

    const newTeam = {
      teamId: getTeamId(competition, last),
      participants,
      competition,
      isIndividual,
      token: last[0] ? last[0].token + 1 : 1,
    };
    let result = await Team.create(newTeam);
    updateUser(participants, result._id);
    console.log(result);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

const codes = {
  tennis: "TNNS",
  cricket: "CRKT",
  football: "FTBL",
  kabaddi: "KBDI",
};

function getTeamId(competition, last) {
  let id = codes[competition];
  const result = last[0] ? id + getStringWithToken(last[0].token) : id + "001";
  return result;
}

function getStringWithToken(lastToken) {
  let token = lastToken + 1;
  if (token < 10) return "00" + token;
  else if (token >= 10 && token < 100) {
    return "0" + token;
  } else if (token >= 100 && token < 1000) {
    return token;
  }
}

async function updateUser(participants, teamObjectId) {
  for (let email of participants) {
    if (!email) continue;
    const user = await User.findOne({ email });
    const teams = user.teams;
    teams.push(teamObjectId);
    user.teams = teams;
    user.save();
  }
}

module.exports = router;
