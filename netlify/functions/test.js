// netlify/functions/test.js
exports.handler = async function (event, context) {
  console.log('🧪 테스트 함수 실행됨!');
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Netlify Function이 정상 작동합니다!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      openaiKeyExists: !!(process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY)
    })
  };
};
