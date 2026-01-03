import { useRef, useState, useEffect } from "react"
import { Button } from "../ui/button"
import type { CategoryType, MenuType } from "@/lib/types"
import { Img } from "../ui/img-component"
import { ProductCard } from "./product-card"
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant"

type Props = {
  menus: MenuType[]
  categories: CategoryType[]
}

export function CategoryList({ menus, categories }: Props) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  const restaurant = useRestaurant();
  const isGrid = restaurant?.settings?.isGrid ?? false;
  const [showLeanButtonsAll, setShowLeanButtonsAll] = useState(false)

  // Sort categories by order (default to 0) and filter only those with products
  const filteredCategories: CategoryType[] = categories
    .filter(cat => menus.some(p => p.categories.includes(cat.id)))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // Refs for each category section
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Intersection Observer to detect which category is in view
  useEffect(() => {
    // keep refs array length in sync with filteredCategories
    sectionRefs.current = sectionRefs.current.slice(0, filteredCategories.length)

    if (typeof window === "undefined") return
    if (sectionRefs.current.length === 0) return

    const observer = new IntersectionObserver(
      () => {
        // Determine if any section except the first is visible in the viewport
        const anyNonFirstVisible = sectionRefs.current.slice(1).some((section) => {
          if (!section) return false
          const rect = section.getBoundingClientRect()
          return rect.top < window.innerHeight && rect.bottom > 0
        })

        setShowLeanButtonsAll(Boolean(anyNonFirstVisible))

        // Find the section whose top is closest to a reference point (near top).
        // This gives a stable "active" index.
        const referenceOffset = 80 // tweak if you have a sticky header height
        let closestIdx = 0
        let minDistance = Infinity

        sectionRefs.current.forEach((section, idx) => {
          if (!section) return
          const rect = section.getBoundingClientRect()
          const distance = Math.abs(rect.top - referenceOffset)
          if (distance < minDistance) {
            minDistance = distance
            closestIdx = idx
          }
        })

        setActiveCategoryIndex((prev) => (prev === closestIdx ? prev : closestIdx))
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px",
        // multiple thresholds help observer trigger reliably across devices
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    // observe current sections
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    // run once immediately to initialize states (no need to wait for the first observer callback)
    // This covers initial mount / SSR -> client hydration cases.
    const init = () => {
      const anyNonFirstVisible = sectionRefs.current.slice(1).some((section) => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      })
      setShowLeanButtonsAll(Boolean(anyNonFirstVisible))

      const referenceOffset = 80
      let closestIdx = 0
      let minDistance = Infinity
      sectionRefs.current.forEach((section, idx) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top - referenceOffset)
        if (distance < minDistance) {
          minDistance = distance
          closestIdx = idx
        }
      })
      setActiveCategoryIndex(closestIdx)
    }
    // call on next animation frame to make sure DOM is painted
    requestAnimationFrame(init)

    return () => {
      observer.disconnect()
    }
  }, [filteredCategories])

  // optional log to debug state updates
  useEffect(() => {
    console.log("SECTION", activeCategoryIndex, "LEAN_ALL", showLeanButtonsAll)
  }, [activeCategoryIndex, showLeanButtonsAll])

  const handleScrollToCategory = (index: number) => {
    setActiveCategoryIndex(index)
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const showCategoryImages = false

  // decide if we should render lean buttons for all categories
  // rules:
  //  - if images are disabled (showCategoryImages === false) -> always lean buttons
  //  - else if images enabled and showLeanButtonsAll === true -> lean buttons for all
  //  - else (images enabled and showLeanButtonsAll === false) -> image buttons for all
  const shouldShowLeanForAll = !showCategoryImages || showLeanButtonsAll

  return (
    <div className="space-y-6">
      {/* Categories Scroll */}
      <div
        className={`
          relative w-full 
          ${true ? "sticky" : ""}
          ${false ? "top-16" : "top-0 z-12"}
          ${"bg-white"}
          border-b border-gray-100
        `}
      >
        <div
          className={`
            ${false ? "top-16" : "top-0 z-0"}
            px-4 py-4 flex items-center space-x-2 
            overflow-x-auto scroll-smooth 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            whitespace-nowrap
          `}
        >
          {filteredCategories.map((category, i) => {
            // const isActive = i === activeCategoryIndex

            if (shouldShowLeanForAll) {
              // RENDER LEAN BUTTON FOR ALL
              return (
                <Button
                  key={category.id}
                  onClick={() => handleScrollToCategory(i)}
                  className={`
                    rounded-full px-4 py-2 h-9
                    transition-all duration-200
                    hover:scale-105 hover:shadow-sm
                    active:scale-95
                    focus-visible:ring-2 focus-visible:ring-offset-2
                    text-sm font-medium
                    ${"text-white"}
                    ${"bg-amber-600"}
                  `}
                >
                  {category.name}
                </Button>
              )
            }

            // RENDER IMAGE BUTTON (images enabled & first section visible)
            return (
              <button
                key={category.id}
                onClick={() => handleScrollToCategory(i)}
                className={`
                  flex flex-col items-center space-y-2 px-2 py-3
                  transition-all duration-200
                  hover:scale-105 hover:shadow-sm
                  active:scale-95
                  focus-visible:ring-2 focus-visible:ring-offset-2
                  rounded-lg border 
                  min-w-20 
                `}
              >
                {category.imageUrl && (
                  <div className="w-10 h-10  rounded overflow-hidden flex-shrink-0">
                    <Img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span
                  className="text-xs px-2 font-medium text-center leading-tight break-words line-clamp-2"
                >
                  {category.name}
                </span>

              </button>
            )
          })}
        </div>

        {/* Gradient fade effect */}
        {/* <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" /> */}
      </div>

      {/* Category Sections */}
      <div className="space-y-12 px-4">
        {filteredCategories.map((category, i) => {
          const categoryProducts = menus.filter(p => p.categories.includes(category.id))

          return (
            <section
              key={category.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[i] = el
              }}
              className="space-y-6 py-2 scroll-mt-24"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {category.name}
                  </h2>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid ${isGrid ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                {categoryProducts.map(menu => (
                  <ProductCard key={menu.id} menu={menu} />
                ))}
              </div>

              {/* Empty State */}
              {categoryProducts.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">No products available</div>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}