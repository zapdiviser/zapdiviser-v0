interface EventType {
  id: "cart_abandonment" | "checkout" | "purchase" | "product_view" | "product_add_to_cart" | "product_remove_from_cart" | "product_add_to_wishlist" | "product_remove_from_wishlist" | "product_add_to_compare" | "product_remove_from_compare" | "product_review" | "product_question" | "product_answer" | "product_comment" | "product_comment_reply" | "product_comment_like" | "product_comment_reply_like" | "product_comment_dislike" | "product_comment_reply_dislike" | "product_comment_report" | "product_comment_reply_report"
  name: string
}

const eventTypes: EventType[] = [
  { id: "cart_abandonment", name: "Carrinho abandonado" }
]

export default eventTypes
