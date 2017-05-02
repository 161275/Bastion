/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  sql.all('SELECT userID, bastionCurrencies FROM profiles ORDER BY bastionCurrencies DESC LIMIT 10').then(profiles => {
    let fields = [];
    for (let i = 0; i < profiles.length; i++) {
      user = message.guild.members.map(m => m.id).includes(profiles[i].userID) ? `${message.guild.members.get(profiles[i].userID).user.username}#${message.guild.members.get(profiles[i].userID).user.discriminator}` : profiles[i].userID
      fields.push({
        name: `${i+1}. ${user}`,
        value: `${profiles[i].bastionCurrencies} Bastion Currencies`,
        inline: true
      });
    }
    message.channel.send({embed: {
      color: Bastion.colors.blue,
      title: 'Leaderboard',
      description: `Top ${profiles.length} users with highest Bastion Currencies`,
      fields: fields
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['lb']
};

exports.help = {
  name: 'leaderboard',
  description: 'Shows the top 10 ranking with the highest amount of Bastion Currencies from all the users of the bot.',
  permission: '',
  usage: 'leaderboard',
  example: []
};
