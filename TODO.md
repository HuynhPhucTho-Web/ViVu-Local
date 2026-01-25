# TODO List for Fixing Post and Comment Issues

## Completed Tasks
- [x] Fixed field name mismatch in Social.jsx: Kept 'author' and 'timestamp' to match existing data
- [x] Added error handling to handleCreatePost in Social.jsx
- [x] Reverted query in Social.jsx to order by 'timestamp' to show existing posts
- [x] Added recursive comment counting function in PostCard.jsx
- [x] Updated comment count display to include replies
- [x] Added try-catch blocks to handleReact, handleCommentReact, handleUpdatePost, and handleCommentSubmit in PostCard.jsx

## Summary
All major issues have been addressed:
- Posting functionality now works with proper error handling
- Comment counts now include replies for accurate display
- Like functionality has error handling and should work properly
- Existing posts are now visible again (kept original field names)
