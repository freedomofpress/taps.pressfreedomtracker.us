import { html } from 'htm/preact'
import Autolinker from 'autolinker'
import getContentSizeClass from '../utils/getContentSizeClass.js'

const PostBody = ({ post }) => {
        return html`
            <div class="post-body">
                <div
                    class="post-content post-content-${getContentSizeClass(post.content)}"
                    dangerouslySetInnerHTML=${{
                        __html: Autolinker.link(
                            post.content,
                            {
                                newWindow: false,
                                truncate: {
                                    length: 38,
                                    location: 'smart',
                                },
                            }
                        )
                    }}
                ></div>
                ${!!post.images && post.images.map(image => {
                    // Check if image was successfully processed (has webp or jpeg sizes)
                    const hasProcessedSizes = image.sizes && (image.sizes.webp || image.sizes.jpeg)

                    if (hasProcessedSizes) {
                        // Render processed image with multiple sources
                        const webpSizes = image.sizes.webp || []
                        const jpegSizes = image.sizes.jpeg || []

                        return html`
                            <picture class="post-image">
                                ${webpSizes.length > 0 && html`
                                    <source
                                        srcset="${webpSizes.map(img => `${img.url} ${img.width}w`).join(', ')}"
                                        type="image/webp"
                                    />
                                `}
                                ${jpegSizes.length > 0 && html`
                                    <source
                                        srcset="${jpegSizes.map(img => `${img.url} ${img.width}w`).join(', ')}"
                                        type="image/jpeg"
                                    />
                                `}
                                <img
                                    src="${jpegSizes[0]?.url || webpSizes[0]?.url || image.original}"
                                    alt="${image.alt || ''}"
                                    loading="lazy"
                                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                />
                            </picture>
                        `
                    } else if (image.sizes?.fallback) {
                        // Render link for failed processing (privacy-preserving)
                        return html`
                            <div class="post-image-fallback">
                                <p>
                                    📷 <a href="${image.original}" target="_blank" rel="noopener noreferrer">
                                        View original image
                                    </a>
                                    <br />
                                    <small class="fallback-note">
                                        (Image processing failed - link provided for privacy)
                                    </small>
                                </p>
                            </div>
                        `
                    }
                    return null
                })}
                ${!!post.mediaDescription.trim() && html`
                    <dl class="post-media-description">
                        <dt>Media Description</dt>
                        <dd>${post.mediaDescription}</dd>
                    </dl>
                `}
            </div>
        `
}

export default PostBody
