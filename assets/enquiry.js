const form = document.querySelector('#enquiry');
const opener = document.querySelector('#show-enquiry');
const submit = document.querySelector('#send-enquiry');
const copy = {
  zh: ['資料僅用於回覆這次詢問。請勿提供付款資料。','詢問主題','請選擇','作品與語言版本','購買或下載','授權與合作','其他','回覆信箱','詢問內容（如與作品有關，請附曲名）','稱呼（選填）','送出詢問','傳送中…','已收到你的詢問，我們會透過電子郵件回覆。','目前無法確認送出結果。你可以寫信到 info@oculusfontis.com。','請填寫這個欄位。','請輸入有效的電子郵件地址。'],
  hans: ['你填写的信息仅用于回复本次咨询。请勿提供支付信息。','咨询主题','请选择','作品和语言版本','购买或下载','授权与合作','其他','回复邮箱','咨询内容（如涉及作品，请附上曲名）','称呼（选填）','提交咨询','正在发送…','已收到你的咨询，我们会通过电子邮件回复。','暂时无法确认提交结果。你可以发邮件到 info@oculusfontis.com。','请填写此项。','请输入有效的电子邮箱地址。'],
  en: ['We use your details to reply to this enquiry. Please omit payment information.','Enquiry topic','Choose a topic','Music and language editions','Purchase or download','Licensing or collaboration','Other','Email for reply','Your message (include the work title if relevant)','Name (optional)','Send enquiry','Sending…','Your enquiry has been received. We’ll reply by email.','We could not confirm receipt. You can email info@oculusfontis.com.','Please complete this field.','Enter a valid email address.'],
  ja: ['ご記入いただいた情報は、お問い合わせへの返信に使用します。決済情報は記入しないでください。','お問い合わせの種類','選択してください','作品・言語版','購入・ダウンロード','利用許諾・コラボ','その他','返信先メールアドレス','お問い合わせ内容（関連する作品があれば作品名もご記入ください）','お名前（任意）','送信する','送信中…','お問い合わせを受け付けました。メールでご返信します。','送信結果を確認できませんでした。info@oculusfontis.com までお問い合わせください。','この項目を入力してください。','有効なメールアドレスを入力してください。']
};
let statusIndex;
const words = () => copy[document.body.className] || copy.zh;
function updateEnquiryLanguage() {
  const w = words();
  const labels = {'form-intro':0,'topic-label':1,'email-label':7,'message-label':8,'name-label':9,'send-enquiry':10};
  for (const [id,i] of Object.entries(labels)) document.getElementById(id).textContent = w[i];
  Array.from(form.elements.topic.options).forEach((option,i) => option.textContent=w[i+2]);
  document.getElementById('form-status').textContent = w[statusIndex] || '';
  for (const field of form.querySelectorAll('[required]')) field.setCustomValidity('');
}
window.updateEnquiryLanguage = updateEnquiryLanguage;
updateEnquiryLanguage();
opener.addEventListener('click', () => {
  form.hidden = !form.hidden;
  opener.setAttribute('aria-expanded',String(!form.hidden));
  if (!form.hidden) form.elements.topic.focus();
});
form.addEventListener('invalid', event => {
  const f = event.target;
  f.setCustomValidity(words()[f.validity.typeMismatch ? 15 : 14]);
},true);
form.addEventListener('input', event => event.target.setCustomValidity(''));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submit.disabled) return;
  submit.disabled = true;
  statusIndex = 11;
  updateEnquiryLanguage();
  try {
    const response = await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    if (!response.ok || !(await response.json()).received) throw new Error();
    form.reset();
    statusIndex = 12;
  } catch { statusIndex = 13; }
  submit.disabled = false;
  updateEnquiryLanguage();
});
