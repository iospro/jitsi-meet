/**
 * MenuViewDarkModePatch.m
 *
 * Patches MenuViewImplementation (from @react-native-menu/menu) at runtime so that
 * UIContextMenuInteraction always renders in the style requested by the `themeVariant` prop.
 *
 * Without this patch the native UIContextMenu ignores `themeVariant` and inherits the
 * app's current user-interface style (light/dark), showing a white menu in light mode.
 *
 * This approach avoids modifying any CocoaPods source files:
 *  - Uses Objective-C `+load` (runs before main(), no AppDelegate call needed).
 *  - `class_replaceMethod` adds the override directly to MenuViewImplementation so
 *    no other UIView subclass is affected.
 *  - `imp_implementationWithBlock` captures the original IMP cleanly.
 */

#import <UIKit/UIKit.h>
#import <objc/runtime.h>

@interface UIView (MenuViewDarkModePatch)
@end

@implementation UIView (MenuViewDarkModePatch)

+ (void)load {
    Class cls = NSClassFromString(@"MenuViewImplementation");
    if (!cls) {
        return; // Library not linked – nothing to do.
    }

    SEL sel = @selector(traitCollection);

    // Capture the IMP that MenuViewImplementation currently uses for -traitCollection.
    // If the class does not override it, this is UIView's inherited implementation.
    IMP originalIMP = [cls instanceMethodForSelector:sel];
    if (!originalIMP) {
        return;
    }

    const char *typeEncoding = method_getTypeEncoding(class_getInstanceMethod([UIView class], sel));

    // Build a replacement IMP that reads _themeVariant and forces the matching
    // UIUserInterfaceStyle into the returned UITraitCollection.
    IMP patchIMP = imp_implementationWithBlock(^UITraitCollection *(id blockSelf) {
        // Call the original implementation (may be UIView's or an existing override).
        UITraitCollection *base = ((UITraitCollection *(*)(id, SEL))originalIMP)(blockSelf, sel);

        NSString *variant = nil;
        @try {
            // _themeVariant is a Swift stored property on MenuViewImplementation.
            // KVC works because the class ultimately inherits from NSObject.
            variant = [blockSelf valueForKey:@"_themeVariant"];
        } @catch (NSException *__unused e) {
            // Key not found – leave variant nil, return base unchanged.
        }

        UIUserInterfaceStyle style = UIUserInterfaceStyleUnspecified;
        if ([variant isEqualToString:@"dark"]) {
            style = UIUserInterfaceStyleDark;
        } else if ([variant isEqualToString:@"light"]) {
            style = UIUserInterfaceStyleLight;
        }

        if (style == UIUserInterfaceStyleUnspecified) {
            return base;
        }

        return [UITraitCollection traitCollectionWithTraitsFromCollections:@[
            base,
            [UITraitCollection traitCollectionWithUserInterfaceStyle:style]
        ]];
    });

    // Replace (or add if not yet overridden) -traitCollection on MenuViewImplementation only.
    class_replaceMethod(cls, sel, patchIMP, typeEncoding);
}

@end
