'use client';

export function SocialLinks() {
  return (
    <div className="fixed top-8 left-8 z-50 flex gap-3">
      {/* Telegram */}
      <a
        href="https://t.me/dsa885"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 glass"
        title="Telegram"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </a>

      {/* Twitter/X */}
      <a
        href="https://x.com/hunterweb303"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 glass"
        title="X (Twitter)"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* GitHub */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('GitHub link will be added soon!');
        }}
        className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 glass cursor-pointer"
        title="GitHub (Coming Soon)"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  );
}
