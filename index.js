import React from 'react'

import { Plugin } from '@vizality/entities'
import { patch, unpatch } from '@vizality/patcher'
import { getModule, FluxDispatcher } from '@vizality/webpack'
import { findInReactTree } from '@vizality/util/react'
import { ContextMenu } from '@vizality/components'

const { getVoiceChannelId } = getModule('getVoiceChannelId')
const { countVoiceStatesForChannel } = getModule('countVoiceStatesForChannel')

import queueChannel, { queue } from './apis/queueChannel'

export default class QueueVoiceChannels extends Plugin {
  async start() {
    FluxDispatcher.subscribe('VOICE_STATE_UPDATE', voiceState => queueChannel(voiceState))
    const VoiceChannelContextMenu = await getModule(m => m.default?.displayName === 'ChannelListVoiceChannelContextMenu')
    patch('queue-voice-channels', VoiceChannelContextMenu, 'default', (args, res) => {
      const UserCount = countVoiceStatesForChannel(args[0].channel.id)
      const InDevMode = Boolean(findInReactTree(res, r => r.props?.children?.key === 'devmode-copy-id'))
      const ChannelFull = Boolean(UserCount >= args[0].channel.userLimit && args[0].channel.userLimit !== 0)
      if (ChannelFull && args[0].channel.id !== getVoiceChannelId())
        res.props.children.splice(
          res.props.children.length - InDevMode, 0,
          <ContextMenu.Group>
            <ContextMenu.Item
              id='queue-vc'
              label={`${queue?.channel === args[0].channel ? 'Unq' : 'Q'}ueue Voice Channel`}
              action={() => queue = queue?.channel === args[0].channel ? null : args[0]}/>
          </ContextMenu.Group>
        )
    })
  }
  stop() { 
    unpatch('queue-voice-channels') 
    FluxDispatcher.unsubscribe('VOICE_STATE_UPDATE', 
      voiceState => queueChannel(voiceState))
  }
}