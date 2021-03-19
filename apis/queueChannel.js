import { getModule, FluxDispatcher } from '@vizality/webpack'
import { sleep } from '@vizality/util/time'

const { countVoiceStatesForChannel } = getModule('countVoiceStatesForChannel')
const { selectVoiceChannel } = getModule('selectVoiceChannel')

export default async (voiceState) => {
  if (voiceState.guildId === queue?.guild.id) {
    await sleep(300) // voice states actually take a litle bit to fully update
    if (countVoiceStatesForChannel(queue.channel.id) < queue.channel.userLimit) {
      selectVoiceChannel(queue.channel.id), queue = null
    }
  }
}

export let queue