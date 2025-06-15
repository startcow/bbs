from flask import jsonify
from . import api
import requests
from bs4 import BeautifulSoup
import urllib.parse

@api.route('/spider/notices', methods=['GET'])
def get_notices():
    try:
        target_url = "https://www.ucas.ac.cn/tz/index.htm"
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.text, 'html.parser')

        notices = []
        notice_list = soup.select('ul.list18 li')

        for li in notice_list:
            a_tag = li.find('a')
            if a_tag:
                title = a_tag.get_text(strip=True)
                href = a_tag.get('href')
                full_url = urllib.parse.urljoin(target_url, href)
                notices.append({
                    'title': title,
                    'url': full_url
                })

        return jsonify({
            'message': '获取通知成功',
            'notices': notices
        })

    except Exception as e:
        return jsonify({
            'message': f'获取通知失败：{str(e)}'
        }), 500