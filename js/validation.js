/*
    1. input value;
*/
// 이메일 직접입력 select
const dirDomain = (el) => {
  let domainList = el;
  domainList = domainList.value;
  if (domainList === "직접입력") {
    el.previousElementSibling.value = "";
    el.disabled = false;
  } else {
    el.previousElementSibling.value = domainList;
    el.previousElementSibling.disabled = true;
  }
};

const validateForm = (el) => {
  const f = el;
  // 이메일 check
  const email = f.firstEmail.value + "@" + f.secondEmail.value;
  if (!validateEmail(email)) {
    alert("error");
    return;
  }
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 핸드폰 번호 체크
  const phoneNumber = f.phoneNumber.value;
  if (!validatePhoneNumber(phoneNumber)) {
    alert("error");
    return;
  }
  function validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    return phoneNumberRegex.test(phoneNumber);
  }
  //const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
};
