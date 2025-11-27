// Handler for onclick on #['window-btn']:
window.pywebview.api.minimize();


// Handler for onclick on #['window-btn']:
window.pywebview.api.close();


// Handler for onclick on #trackingBtn:
toggleTracking();


// Handler for onchange on #vkChannel:
onVkChannelInput(this.value);


// Handler for onchange on #twitchChannel:
onTwitchChannelInput(this.value);


// Handler for onchange on #reward_clip:
reward_clip();


// Handler for onchange on #reward_clip_out:
reward_clip_out();


// Handler for onchange on #reward_voice:
reward_voice();


// Handler for onchange on #reward_joke:
reward_joke();


// Handler for onchange on #reward_aphorism:
reward_aphorism();


// Handler for onchange on #reward_fact:
reward_fact();


// Handler for onchange on #reward_science:
reward_science();


// Handler for onchange on #reward_history:
reward_history();


// Handler for oninput on #obs-host:
autoSaveObsConfig();


// Handler for oninput on #obs-port:
autoSaveObsConfig();


// Handler for oninput on #obs-password:
autoSaveObsConfig();


// Handler for oninput on #dropPercentThresholdSlider:
onDropPercentThresholdSliderChange(this.value);


// Handler for onchange on #obs_video:
obs_video();


// Handler for onchange on #obs_target:
obs_target();


// Handler for onchange on #collect_viewers:
onCollectViewersChange();


// Handler for onclick on #['style-box']:
selectStyle(1);


// Handler for onclick on #['style-box']:
selectStyle(2);


// Handler for onclick on #['style-box']:
selectStyle(3);


// Handler for onclick on #['style-box']:
selectStyle(4);


// Handler for onclick on #['style-box']:
selectStyle(5);


// Handler for onclick on #['style-box']:
selectStyle(6);


// Handler for onclick on #['style-box']:
selectStyle(7);


// Handler for onclick on #['style-box']:
selectStyle(8);


// Handler for onclick on #['style-box']:
selectStyle(9);


// Handler for onclick on #['style-box']:
selectStyle(10);


// Handler for onclick on #['style-box']:
selectStyle(11);


// Handler for onclick on #['style-box']:
selectStyle(12);


// Handler for onclick on #['style-box']:
selectStyle(13);


// Handler for onclick on #obsLink:
this.select(); document.execCommand('copy');


// Handler for onchange on #chatTimeout:
onChatTimeoutChange();


// Handler for oninput on #chatBgColor:
onChatSizeChange();


// Handler for onchange on #chatBgAlpha:
onChatSizeChange();


// Handler for oninput on #chatTextColor:
onChatTextColorChange();


// Handler for oninput on #chatTextColorName:
onChatTextColorNameChange();


// Handler for onchange on #chat_frame:
onChatFrameChange();


// Handler for onchange on #chat_framen:
onChatFramenChange();


// Handler for onchange on #chat_time:
onChatTimeChange();


// Handler for onchange on #chatHeightOv:
onChatSizeChangeOv();


// Handler for onchange on #overlayToggle:
toggleOverlay('overlay', this.checked);


// Handler for onchange on #chatWidthOv:
onChatSizeChangeOv();


// Handler for onchange on #chatWidthX:
onChatSizeChangeOv();


// Handler for onchange on #chatWidthY:
onChatSizeChangeOv();


// Handler for onchange on #chatZoomOv:
onChatSizeChangeOv();


// Handler for onchange on #chatOvd:
onChatSizeChangeOv();


// Handler for onchange on #overlay2Toggle:
toggleOverlay('overlay2', this.checked); toggleInputs2(this.checked);


// Handler for onchange on #window1_width:
window1_width();


// Handler for onchange on #window1_height:
window1_height();


// Handler for onchange on #chatOvd2:
onChatSizeChangeOv2();


// Handler for onchange on #overlay3Toggle:
toggleOverlay('overlay3', this.checked); toggleInputs3(this.checked);


// Handler for onchange on #window2_width:
window2_width();


// Handler for onchange on #window2_height:
window2_height();


// Handler for onchange on #voiceSelect:
onVoiceChange(this.value);


// Handler for onchange on #ttsToggleSwitch:
onTtsToggle(this.checked);


// Handler for oninput on #ttsVolumeSlider:
onTtsVolumeSliderChange(this.value);


// Handler for onclick on #['btn-primary']:
testTts();


// Handler for onclick on #['btn', 'btn-primary']:
openAddAuthorModal();


// Handler for onclick on #['btn', 'btn-secondary']:
closeAuthorsModal();


// Handler for onclick on #['btn', 'btn-danger']:
confirmDeleteAuthorNow();


// Handler for onclick on #['btn', 'btn-secondary']:
closeDeleteAuthorModal();


// Handler for onclick on #['btn', 'btn-primary']:
saveAuthor();


// Handler for onclick on #['btn', 'btn-secondary']:
closeAuthorModal();


// Handler for onchange on #tts_text:
tts_text();


// Handler for onchange on #tts_scream:
tts_scream();


// Handler for onchange on #site_text:
site_text();


// Handler for onchange on #welcome_portal:
welcome_portal();


// Handler for onchange on #tts_text_raid:
tts_text_raid();


// Handler for onchange on #stat_sender:
onStatSenderChange();


// Handler for onchange on #skip_repeated_sender:
onSkipRepeatedSenderChange();


// Handler for onchange on #tts_clip:
onTtsClipChange();


// Handler for onclick on #['btn', 'btn-primary']:
openAuthorsModal();


// Handler for onchange on #char_repeat_threshold:
updateSpamThresholds();


// Handler for onchange on #word_repeat_sequence_length:
updateSpamThresholds();


// Handler for onchange on #phrase_repeat_threshold:
updateSpamThresholds();


// Handler for onchange on #special_char_repeat_threshold:
updateSpamThresholds();


// Handler for onchange on #emoji_repeat_threshold:
updateSpamThresholds();


// Handler for onchange on #max_emojis_total:
updateSpamThresholds();


// Handler for onclick on #['close']:
closeModal();


// Handler for onclick on #['btn', 'btn-danger']:
confirmDelete();


// Handler for onclick on #['btn', 'btn-secondary']:
closeConfirmDeleteModal();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
openCreateRewardModal();


// Handler for onclick on #['btn', 'btn-primary']:
submitCreateReward();


// Handler for onclick on #['btn', 'btn-secondary']:
closeCreateRewardModal();


// Handler for onclick on #alerts-link:
openAlerts(event);


// Handler for onchange on #sub-audio-toggle:
onSubAudioToggleChange();


// Handler for onchange on #sub-audio-file:
uploadSubAudio(this);


// Handler for onclick on #['btn', 'btn-primary']:
document.getElementById('sub-audio-file').click();


// Handler for onchange on #sub-tts-toggle:
onSubTtsToggleChange();


// Handler for oninput on #sub-tts-text:
onSubTtsTextChange();


// Handler for onchange on #effect-sub-audio-toggle:
onEffectSubAudioToggleChange();


// Handler for onchange on #effect-sub-audio-file:
uploadEffectSubAudio(this);


// Handler for onclick on #['btn', 'btn-primary']:
document.getElementById('effect-sub-audio-file').click();


// Handler for onchange on #effect-sub-tts-toggle:
onEffectSubTtsToggleChange();


// Handler for oninput on #effect-sub-tts-text:
onEffectSubTtsTextChange();


// Handler for onchange on #portal-audio-toggle:
onPortalAudioToggleChange();


// Handler for onchange on #portal-audio-file:
uploadPortalAudio(this);


// Handler for onclick on #['btn', 'btn-primary']:
document.getElementById('portal-audio-file').click();


// Handler for onchange on #portal-tts-toggle:
onPortalTtsToggleChange();


// Handler for oninput on #portal-tts-text:
onPortalTtsTextChange();


// Handler for onchange on #raid-audio-toggle:
onRaidAudioToggleChange();


// Handler for onchange on #raid-audio-file:
uploadRaidAudio(this);


// Handler for onclick on #['btn', 'btn-primary']:
document.getElementById('raid-audio-file').click();


// Handler for onchange on #raid-tts-toggle:
onRaidTtsToggleChange();


// Handler for oninput on #raid-tts-text:
onRaidTtsTextChange();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
openCreateEventModal();


// Handler for onclick on #['btn', 'btn-primary']:
submitCreateEvent();


// Handler for onclick on #['btn', 'btn-secondary']:
closeCreateEventModal();


// Handler for onclick on #event-user-file-path:
copyEventUserFilePath();


// Handler for oninput on #vlcVolumeSlider:
onVlcVolumeSliderChange(this.value);


// Handler for oninput on #volumeSlider:
onVolumeSliderChange(this.value);


// Handler for onchange on #maxVideoLength:
onMaxVideoLengthChange(this.value);


// Handler for onchange on #minViews:
onMinViewsChange(this.value);


// Handler for onclick on #['btn', 'btn-danger']:
confirmClearQueueNow();


// Handler for onclick on #['btn', 'btn-secondary']:
closeClearQueueModal();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
pauseVideo();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
stopVideo();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
resumeVideo();


// Handler for onclick on #['btn', 'btn-primary', 'btn-round', 'custom-btn', 'btn-16']:
skipVideo();


// Handler for onclick on #['btn', 'btn-danger']:
openClearQueueModal();


// Handler for onclick on #button:
filterByPlatform(null);


// Handler for onclick on #button:
filterByPlatform('Twitch');


// Handler for onclick on #button:
filterByPlatform('VK');


// Handler for oninput on #searchInput:
onSearchInput(this.value);
