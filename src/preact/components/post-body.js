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
                                stripPrefix: false,
                                stripTrailingSlash: false,
                                newWindow: false,
                                truncate: {
                                    length: 30,
                                    location: 'smart',
                                },
                            }
                        )
                    }}
                ></div>
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