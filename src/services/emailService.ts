export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // FormData를 사용하여 이메일 전송
    const emailData = new FormData();
    emailData.append('to', 'iamspace@kakao.com');
    emailData.append('from', formData.email);
    emailData.append('subject', `[선물지니 문의] ${formData.subject}`);
    emailData.append('name', formData.name);
    emailData.append('message', formData.message);
    
    // FormSubmit.co 서비스를 사용하여 이메일 전송
    const response = await fetch('https://formsubmit.co/iamspace@kakao.com', {
      method: 'POST',
      body: emailData,
    });

    if (!response.ok) {
      throw new Error('이메일 전송에 실패했습니다.');
    }

    return true;
  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return false;
  }
};
