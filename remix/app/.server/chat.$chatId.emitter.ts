import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';
import { getEventStreamEmitter } from '@remix/.server/services/chats';

export const loader: LoaderFunction = ({ params, request }) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });
  const { chatId } = params;

  return new EventStream(request, (send) => {
    const eventStreamEmitter = getEventStreamEmitter();

    function handleAgentMessage(params: unknown) {
      send(JSON.stringify(params), { channel: `agent:${chatId}` });
    }
    eventStreamEmitter.addListener(`agent:${chatId}`, handleAgentMessage);

    function handleChatMessage(params: unknown) {
      send(JSON.stringify(params), { channel: `chat:${chatId}` });
    }
    eventStreamEmitter.addListener(`chat:${chatId}`, handleChatMessage);

    return () => {
      eventStreamEmitter.removeListener(`agent:${chatId}`, handleAgentMessage);
      eventStreamEmitter.removeListener(`chat:${chatId}`, handleChatMessage);
    };
  });
};
