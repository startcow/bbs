class AIConfig:
    # 硅基云API配置
    API_URL = "https://api.siliconflow.cn/v1/chat/completions"
    API_KEY = "sk-uuojaiyfcofemhjkhdgphdkwdwuskkrshbqwoowlmiuhtmat"  # 替换为你的API密钥
    MODEL = "deepseek-ai/DeepSeek-V3"
    
    # 请求参数配置
    TEMPERATURE = 0.7
    MAX_TOKENS = 1024
    RESPONSE_FORMAT = {"type": "text"}
    
    # 请求超时设置
    TIMEOUT = 30
    
    # 重试设置
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # 秒