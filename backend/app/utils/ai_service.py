import requests
import time
from app.config.ai_config import AIConfig
from rich.console import Console

console = Console()

class AIService:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {AIConfig.API_KEY}",
            "Content-Type": "application/json"
        }
        self.messages = []

    def chat_completion(self, prompt):
        self.messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": AIConfig.MODEL,
            "messages": self.messages,
            "temperature": AIConfig.TEMPERATURE,
            "max_tokens": AIConfig.MAX_TOKENS,
            "response_format": AIConfig.RESPONSE_FORMAT
        }

        for attempt in range(AIConfig.MAX_RETRIES):
            try:
                response = requests.post(
                    AIConfig.API_URL, 
                    json=payload, 
                    headers=self.headers,
                    timeout=AIConfig.TIMEOUT
                )
                response.raise_for_status()
                content = response.json()['choices'][0]['message']['content']
                self.messages.append({"role": "assistant", "content": content})
                return content
                
            except Exception as e:
                if attempt == AIConfig.MAX_RETRIES - 1:
                    console.print(f"[bold red]API请求失败: {str(e)}[/]")
                    return None
                time.sleep(AIConfig.RETRY_DELAY * (attempt + 1))

    def get_post_suggestions(self, title, content):
        """获取帖子建议"""
        prompt = f"""请分析这篇帖子并给出改进建议：
        标题：{title}
        内容：{content}
        """
        return self.chat_completion(prompt)

    def get_content_moderation(self, content):
        """内容审核"""
        prompt = f"""请检查以下内容是否合规：
        {content}
        """
        return self.chat_completion(prompt)

    def clear_context(self):
        """清除对话上下文"""
        self.messages = []