class ListTrie {
    /**
     *
     * @param {string} ch 单个单词
     *
     */
    constructor(ch) {
        this.ch = ch || ''
        this.code = this.ch.codePointAt(0)
        this.wordCount = 0
        this.prefixCount = 0
        this.end = false
        this.meta = new Set()
        this.children = []
    }
    /**
     * 向词库中添加单词
     * @param {string} word 添加的单词
     * @param {meta} param1 内部使用项
     * @param {string} [param1.word=]
     */
    add(word, { meta = { word: '' } } = {}) {
        if (word) {
            let ch = [...word][0]
            let code = ch.codePointAt(0)
            let children = this.children
            let child = children.find(v => v.ch == ch)
            if (!meta.word) {
                meta.word = word
            }

            if (!child) {
                this.prefixCount++
                child = new ListTrie(ch)
                children.push(child)
            }
            child.add([...word].slice(1).join(''), { meta })
        } else {
            if (!this.meta.has(meta.word)) {
                this.prefixCount++
            }
            this.meta.add(meta.word)
            this.wordCount++
            this.end = true
        }
    }
    /**
     * 更新词库
     * @param {string} oldWord 旧的单词
     * @param {string} newWord 新的单词
     */
    upDate(oldWord, newWord) {
        this.remvoe(oldWord)
        this.add(oldWord)
    }
    /**
     * 从词库中删除单词
     * @param {string} word 将要删除的单词
     */
    remvoe(word) {
        let { trie, index } = this._walker(word) || {}
        if (!trie) return
        trie.children.splice(index, 1)
    }
    /**
     *
     * @param {string} word
     * @return {ListTrie}
     */
    find(word) {
        let { trie, index } = this._walker(word) || {}
        if (!trie) return null
        return trie.children[index]
    }
    /**
     *
     * @param {string} word
     * @return {boolean}
     */
    hasWord(word) {
        let { trie, index } = this._walker(word) || {}
        if (!trie) return false
        return trie.children[index].end || false
    }
    /**
     *
     * @param {string} ch
     * @return {ListTrie}
     */
    getChild(ch) {
        let children = this.children
        let child = children.find(v => v.ch == ch)
        return child || null
    }
    /**
     *
     * @param {string} ch
     * @return {boolean}
     */
    hasChild(ch) {
        return this.getChild(ch) !== null
    }
    /**
     *
     * @param {string} word
     * @return {number}
     */
    getPrefixCount(word) {
        let { trie, index } = this._walker(word) || {}
        if (!trie) return 0
        return trie.children[index].prefixCount || 0
    }
    getWordCount(word) {
        let { trie, index } = this._walker(word) || {}
        if (!trie) return 0
        return trie.children[index].wordCount
    }
    /**
     *内部使用函数
     * @param {string} word 需要查找的单词
     * @return {Walker}
     */
    _walker(word) {
        if (!word) return null
        word = [...word]
        let ch,
            pre,
            trie = this,
            children,
            index
        while (word.length > 0) {
            ch = word[0]
            children = trie.children
            index = children.findIndex(v => v.ch == ch)
            if (index <= -1) return null
            pre = trie
            trie = children[index]
            word = word.slice(1)
        }
        return { trie: pre, index }
    }
}

/**
 * @typedef {Object} Walker
 * @property {ListTrie} trie
 * @property {number} index
 */

module.exports = ListTrie
