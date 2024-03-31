export function replaceVideoTags(html) {
  while (html.includes('{{<video')) {
    const start = html.indexOf('{{<video');
    const end = html.indexOf('}}', start);
    const videoTag = html.substring(start, end + 2);

    const src = videoTag.match(/src="([^"]+)"/)[1];
    // biome-ignore lint/style/noParameterAssign:
    html = html.replace(
      videoTag,
      `<video controls><source src="${src}" type="video/mp4">Your browser does not support video</video>`,
    );
  }

  return html;
}
