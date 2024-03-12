import type { MetaFunction } from '@remix-run/node';
export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLlm' },
    { content: 'Welcome to CodeLlm!', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <div>
      <div className="p-10 bg-base-100 ">
        <div className="p-5 border-2 border-primary rounded-lg">
          <h1 className="text-4xl">Welcome to CodeLlm!</h1>
          <p className="text-lg">
            This is a simple chatbot that can answer your questions about a code
            project.
          </p>
        </div>
      </div>
    </div>
  );
}

export { action, loader } from '@remix/.server/chat';
