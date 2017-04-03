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
const getRandomInt = require('../../functions/getRandomInt');
sql.open('./data/Bastion.sqlite');
let winners = [];

exports.run = (Bastion, message, args) => {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) return;
  if (isNaN(args = parseInt(args[0])) || args < 0) return;

  let reactions = ['🎈', '🎊', '🎉', '🎃', '🎁', '🎁'];
  let reaction = reactions[getRandomInt(0, reactions.length-1)]
  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'GIVEAWAY! 🎉',
    description: `Giveaway event started. React to this message with ${reaction} to get **${args}** Bastion Currencies.`,
    footer: {
      text: 'Event stops in 1 hour. You will get your reward after the event has concluded.'
    }
  }}).then(msg => {
    setTimeout(function () {
      if (msg.reactions.get(reaction)) winners = msg.reactions.get(reaction).users.map(u => u.id);
      winners.forEach((user, i) => {
        sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(receiver => {
          if (!receiver)
            sql.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [user, args]).catch(e => {
              Bastion.log.error(e.stack);
            });
          else
            sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(receiver.bastionCurrencies)+args} WHERE userID=${user}`).catch(e => {
              Bastion.log.error(e.stack);
            });
        }).then(() => {
          Bastion.users.get(user).sendMessage('', {embed: {
            color: 5088314,
            description: `You have been awarded **${args}** Bastion Currencies for your participation in the giveaway event.`
          }}).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      });
    }, 60 * 60 * 1000);
  }).catch(e => {
    Bastion.log.error(e.stack);
  })
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'giveaway',
  description: 'Starts a giveaway, users get the specified amount of Bastion Currencies if they react to the message with the given reaction, within 1 hour.',
  permission: '',
  usage: 'giveaway <amount>',
  example: ['giveaway 10']
};
