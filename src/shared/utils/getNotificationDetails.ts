function getNotificationDetails(target: EventTarget | null) {
  let type = '';
  let notificationText: string | boolean = '';

  if ((target instanceof HTMLInputElement)) {
    const usageType = target.className.match(/usage_\S*/);
    type = usageType ? usageType[0].replace('usage_', '') : '';
    notificationText = (target.type === 'text') ? target.value : target.checked;
  }

  return { type, notificationText };
}

export default getNotificationDetails;
