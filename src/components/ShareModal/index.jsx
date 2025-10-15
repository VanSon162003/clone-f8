import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFacebook, 
    faTwitter, 
    faLinkedin, 
    faTelegram,
    faWhatsapp
} from "@fortawesome/free-brands-svg-icons";
import { faXmark, faCopy } from "@fortawesome/free-solid-svg-icons";
import styles from "./ShareModal.module.scss";

function ShareModal({ isOpen, onClose, post }) {
    if (!isOpen || !post) return null;

    const postUrl = `${window.location.origin}/blog/${post.slug}`;
    const postTitle = post.title;
    const postDescription = post.description || post.content?.substring(0, 200) + "...";

    const shareLinks = [
        {
            name: "Facebook",
            icon: faFacebook,
            color: "#1877F2",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        },
        {
            name: "Twitter",
            icon: faTwitter,
            color: "#1DA1F2",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`
        },
        {
            name: "LinkedIn",
            icon: faLinkedin,
            color: "#0077B5",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
        },
        {
            name: "Telegram",
            icon: faTelegram,
            color: "#0088CC",
            url: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`
        },
        {
            name: "WhatsApp",
            icon: faWhatsapp,
            color: "#25D366",
            url: `https://wa.me/?text=${encodeURIComponent(`${postTitle} - ${postUrl}`)}`
        }
    ];

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            alert("Đã copy link vào clipboard!");
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = postUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("Đã copy link vào clipboard!");
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Chia sẻ bài viết</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                
                <div className={styles.content}>
                    <div className={styles.postInfo}>
                        <h4>{postTitle}</h4>
                        <p>{postDescription}</p>
                    </div>
                    
                    <div className={styles.shareOptions}>
                        {shareLinks.map((platform) => (
                            <button
                                key={platform.name}
                                className={styles.shareBtn}
                                onClick={() => handleShare(platform.url)}
                                style={{ '--platform-color': platform.color }}
                            >
                                <FontAwesomeIcon icon={platform.icon} />
                                <span>{platform.name}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className={styles.copySection}>
                        <div className={styles.urlInput}>
                            <input 
                                type="text" 
                                value={postUrl} 
                                readOnly 
                                className={styles.urlField}
                            />
                            <button 
                                className={styles.copyBtn}
                                onClick={handleCopyLink}
                            >
                                <FontAwesomeIcon icon={faCopy} />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;
